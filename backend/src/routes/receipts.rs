use axum::{
    body::Bytes,
    extract::{Multipart, Path, Query, State},
    http::{header, HeaderMap, StatusCode},
    response::IntoResponse,
    Json,
};
use serde::{Deserialize, Serialize};
use serde_json::json;
use sha2::{Digest, Sha256};
use subtle::ConstantTimeEq;

use crate::{
    error::{ApiError, ApiResult},
    ingest,
    state::AppState,
};

/// Bearer-token check, done before the multipart body is read.
fn authorize(state: &AppState, headers: &HeaderMap) -> ApiResult<()> {
    let Some(expected) = state.cfg.ingest_token.as_deref() else {
        return Err(ApiError::Unavailable(
            "uploads are disabled: FIRE_INGEST_TOKEN is not set".into(),
        ));
    };
    let given = headers
        .get(header::AUTHORIZATION)
        .and_then(|v| v.to_str().ok())
        .and_then(|v| v.strip_prefix("Bearer "))
        .unwrap_or("");
    if bool::from(given.as_bytes().ct_eq(expected.as_bytes())) {
        Ok(())
    } else {
        Err(ApiError::Unauthorized)
    }
}

/// Detects the image type from its first bytes; the multipart content type from
/// iOS Shortcuts isn't reliable.
fn sniff_mime(bytes: &[u8]) -> ApiResult<&'static str> {
    if bytes.starts_with(b"\x89PNG\r\n\x1a\n") {
        Ok("image/png")
    } else if bytes.starts_with(&[0xFF, 0xD8, 0xFF]) {
        Ok("image/jpeg")
    } else if bytes.len() > 12 && &bytes[0..4] == b"RIFF" && &bytes[8..12] == b"WEBP" {
        Ok("image/webp")
    } else if bytes.starts_with(b"GIF8") {
        Ok("image/gif")
    } else if bytes.len() > 12 && &bytes[4..8] == b"ftyp" {
        Err(ApiError::UnsupportedMedia(
            "HEIC isn't supported; send a PNG or JPEG screenshot".into(),
        ))
    } else {
        Err(ApiError::UnsupportedMedia(
            "expected a PNG, JPEG, WebP or GIF image".into(),
        ))
    }
}

pub async fn upload(
    State(state): State<AppState>,
    headers: HeaderMap,
    mut multipart: Multipart,
) -> ApiResult<impl IntoResponse> {
    authorize(&state, &headers)?;
    if state.extractor.is_none() {
        return Err(ApiError::Unavailable(
            "receipt reading is disabled: FIRE_LLM_* is not set".into(),
        ));
    }

    let mut image: Option<Bytes> = None;
    while let Some(field) = multipart
        .next_field()
        .await
        .map_err(|e| ApiError::BadRequest(format!("invalid multipart body: {e}")))?
    {
        let is_image = field.name() == Some("image") || field.file_name().is_some();
        if is_image {
            image = Some(
                field
                    .bytes()
                    .await
                    .map_err(|e| ApiError::BadRequest(format!("could not read image: {e}")))?,
            );
            break;
        }
    }
    let image = image.ok_or_else(|| ApiError::BadRequest("missing form field \"image\"".into()))?;
    if image.is_empty() {
        return Err(ApiError::BadRequest("image is empty".into()));
    }
    let mime = sniff_mime(&image)?;
    let sha = hex::encode(Sha256::digest(&image));

    let conn = state.conn()?;
    if let Some(existing) = find_by_sha(&conn, &sha).await? {
        return Err(duplicate_upload(existing));
    }
    let inserted = conn
        .query(
            "INSERT INTO receipts (status, image, mime, image_sha256, created_at) \
             VALUES ('processing', ?1, ?2, ?3, ?4) RETURNING id",
            (
                image.to_vec(),
                mime,
                sha.as_str(),
                chrono::Utc::now().to_rfc3339(),
            ),
        )
        .await;
    let id: i64 = match inserted {
        Ok(mut rows) => rows
            .next()
            .await?
            .ok_or_else(|| anyhow::anyhow!("insert returned no id"))?
            .get(0)?,
        // Lost a race with an identical upload.
        Err(e) if e.to_string().contains("UNIQUE") => {
            let existing = find_by_sha(&conn, &sha)
                .await?
                .ok_or(ApiError::Internal(e.into()))?;
            return Err(duplicate_upload(existing));
        }
        Err(e) => return Err(e.into()),
    };

    let bg = state.clone();
    tokio::spawn(async move { ingest::process(&bg, id).await });

    Ok((
        StatusCode::ACCEPTED,
        Json(json!({ "id": id, "status": "processing", "message": "Received, reading it now" })),
    ))
}

async fn find_by_sha(conn: &libsql::Connection, sha: &str) -> anyhow::Result<Option<i64>> {
    let mut rows = conn
        .query("SELECT id FROM receipts WHERE image_sha256 = ?1", [sha])
        .await?;
    Ok(match rows.next().await? {
        Some(row) => Some(row.get(0)?),
        None => None,
    })
}

fn duplicate_upload(receipt_id: i64) -> ApiError {
    ApiError::Conflict(json!({
        "error": "duplicate",
        "receiptId": receipt_id,
        "message": "Already saved",
    }))
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ReceiptView {
    pub id: i64,
    pub status: String,
    pub error: Option<String>,
    pub created_at: String,
    pub processed_at: Option<String>,
    pub duplicate_of: Option<i64>,
    pub llm_model: Option<String>,
    pub transaction: Option<ReceiptTransaction>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub llm_json: Option<String>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ReceiptTransaction {
    pub id: i64,
    pub merchant: String,
    pub direction: String,
    pub category_id: String,
    pub occurred_at: String,
    pub amount_minor: i64,
    pub currency: String,
    pub amount_base_minor: i64,
}

const RECEIPT_SELECT: &str = "SELECT r.id, r.status, r.error, r.created_at, r.processed_at, \
    r.duplicate_of, r.llm_model, r.llm_json, t.id, t.merchant, t.direction, t.category_id, \
    t.occurred_at, t.amount_minor, t.currency, t.amount_base_minor \
    FROM receipts r LEFT JOIN transactions t ON t.receipt_id = r.id";

fn receipt_from_row(row: &libsql::Row, with_json: bool) -> libsql::Result<ReceiptView> {
    let tx_id: Option<i64> = row.get(8)?;
    let transaction = match tx_id {
        Some(id) => Some(ReceiptTransaction {
            id,
            merchant: row.get(9)?,
            direction: row.get(10)?,
            category_id: row.get(11)?,
            occurred_at: row.get(12)?,
            amount_minor: row.get(13)?,
            currency: row.get(14)?,
            amount_base_minor: row.get(15)?,
        }),
        None => None,
    };
    Ok(ReceiptView {
        id: row.get(0)?,
        status: row.get(1)?,
        error: row.get(2)?,
        created_at: row.get(3)?,
        processed_at: row.get(4)?,
        duplicate_of: row.get(5)?,
        llm_model: row.get(6)?,
        llm_json: if with_json { row.get(7)? } else { None },
        transaction,
    })
}

#[derive(Deserialize)]
pub struct ListQuery {
    status: Option<String>,
    limit: Option<i64>,
    offset: Option<i64>,
}

pub async fn list(
    State(state): State<AppState>,
    Query(q): Query<ListQuery>,
) -> ApiResult<Json<Vec<ReceiptView>>> {
    let conn = state.conn()?;
    let limit = q.limit.unwrap_or(50).clamp(1, 500);
    let offset = q.offset.unwrap_or(0).max(0);
    let mut rows = match q.status.as_deref() {
        Some(status) => {
            conn.query(
                &format!(
                    "{RECEIPT_SELECT} WHERE r.status = ?1 ORDER BY r.id DESC LIMIT ?2 OFFSET ?3"
                ),
                (status, limit, offset),
            )
            .await?
        }
        None => {
            conn.query(
                &format!("{RECEIPT_SELECT} ORDER BY r.id DESC LIMIT ?1 OFFSET ?2"),
                (limit, offset),
            )
            .await?
        }
    };
    let mut out = Vec::new();
    while let Some(row) = rows.next().await? {
        out.push(receipt_from_row(&row, false)?);
    }
    Ok(Json(out))
}

pub async fn get(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> ApiResult<Json<ReceiptView>> {
    let conn = state.conn()?;
    let mut rows = conn
        .query(&format!("{RECEIPT_SELECT} WHERE r.id = ?1"), [id])
        .await?;
    let row = rows.next().await?.ok_or(ApiError::NotFound)?;
    Ok(Json(receipt_from_row(&row, true)?))
}

pub async fn image(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> ApiResult<impl IntoResponse> {
    let conn = state.conn()?;
    let mut rows = conn
        .query("SELECT image, mime FROM receipts WHERE id = ?1", [id])
        .await?;
    let row = rows.next().await?.ok_or(ApiError::NotFound)?;
    let bytes: Vec<u8> = row.get(0)?;
    let mime: String = row.get(1)?;
    Ok((
        [
            (header::CONTENT_TYPE, mime),
            (header::CACHE_CONTROL, "private, max-age=86400".into()),
        ],
        bytes,
    ))
}

/// Re-runs extraction for a failed receipt.
pub async fn retry(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> ApiResult<impl IntoResponse> {
    if state.extractor.is_none() {
        return Err(ApiError::Unavailable("receipt reading is disabled".into()));
    }
    let conn = state.conn()?;
    let changed = conn
        .execute(
            "UPDATE receipts SET status = 'processing', error = NULL, processed_at = NULL \
             WHERE id = ?1 AND status = 'failed'",
            [id],
        )
        .await?;
    if changed == 0 {
        let mut rows = conn
            .query("SELECT status FROM receipts WHERE id = ?1", [id])
            .await?;
        return match rows.next().await? {
            None => Err(ApiError::NotFound),
            Some(row) => Err(ApiError::Conflict(json!({
                "error": format!("only failed receipts can be retried (this one is {})", row.get::<String>(0)?),
            }))),
        };
    }
    let bg = state.clone();
    tokio::spawn(async move { ingest::process(&bg, id).await });
    Ok((
        StatusCode::ACCEPTED,
        Json(json!({ "id": id, "status": "processing" })),
    ))
}

/// Deletes a receipt and the transaction made from it.
pub async fn delete(State(state): State<AppState>, Path(id): Path<i64>) -> ApiResult<StatusCode> {
    let conn = state.conn()?;
    let tx = conn.transaction().await?;
    tx.execute(
        "DELETE FROM transaction_items WHERE transaction_id IN (SELECT id FROM transactions WHERE receipt_id = ?1)",
        [id],
    )
    .await?;
    tx.execute(
        "UPDATE receipts SET duplicate_of = NULL WHERE duplicate_of IN (SELECT id FROM transactions WHERE receipt_id = ?1)",
        [id],
    )
    .await?;
    tx.execute("DELETE FROM transactions WHERE receipt_id = ?1", [id])
        .await?;
    let n = tx
        .execute("DELETE FROM receipts WHERE id = ?1", [id])
        .await?;
    tx.commit().await?;
    if n == 0 {
        Err(ApiError::NotFound)
    } else {
        Ok(StatusCode::NO_CONTENT)
    }
}

#[cfg(test)]
pub(crate) mod tests {
    use axum::{body::Body, http::Request};
    use http_body_util::BodyExt;
    use tower::ServiceExt;

    use crate::{
        app,
        llm::{fake, Direction, Extraction},
        state::{test, AppState},
    };

    pub const PNG: &[u8] = b"\x89PNG\r\n\x1a\n-fake-png-body";

    pub fn upload_req(bytes: &[u8], token: &str) -> Request<Body> {
        let boundary = "XBOUNDARY";
        let mut body = Vec::new();
        body.extend_from_slice(
            format!(
                "--{boundary}\r\nContent-Disposition: form-data; name=\"image\"; filename=\"s.png\"\r\n\
                 Content-Type: image/png\r\n\r\n"
            )
            .as_bytes(),
        );
        body.extend_from_slice(bytes);
        body.extend_from_slice(format!("\r\n--{boundary}--\r\n").as_bytes());
        Request::post("/api/receipts")
            .header("authorization", format!("Bearer {token}"))
            .header(
                "content-type",
                format!("multipart/form-data; boundary={boundary}"),
            )
            .body(Body::from(body))
            .unwrap()
    }

    pub async fn json(res: axum::response::Response) -> serde_json::Value {
        let body = res.into_body().collect().await.unwrap().to_bytes();
        serde_json::from_slice(&body).unwrap()
    }

    /// Polls until the receipt leaves `processing`.
    pub async fn wait_done(state: &AppState, id: i64) -> serde_json::Value {
        for _ in 0..200 {
            let res = app(state.clone())
                .oneshot(
                    Request::get(format!("/api/receipts/{id}"))
                        .body(Body::empty())
                        .unwrap(),
                )
                .await
                .unwrap();
            let v = json(res).await;
            if v["status"] != "processing" {
                return v;
            }
            tokio::time::sleep(std::time::Duration::from_millis(10)).await;
        }
        panic!("receipt {id} still processing");
    }

    pub async fn upload_ok(state: &AppState, bytes: &[u8]) -> serde_json::Value {
        let res = app(state.clone())
            .oneshot(upload_req(bytes, test::TOKEN))
            .await
            .unwrap();
        assert_eq!(res.status(), 202);
        let id = json(res).await["id"].as_i64().unwrap();
        wait_done(state, id).await
    }

    #[tokio::test]
    async fn upload_extracts_and_saves_transaction() {
        let (state, _dir) = test::state(vec![Ok(fake::coffee())]).await;
        let r = upload_ok(&state, PNG).await;
        assert_eq!(r["status"], "done", "{r}");
        assert_eq!(r["transaction"]["merchant"], "Kopi Kenangan");
        assert_eq!(r["transaction"]["amountMinor"], -2_500_000);
        assert_eq!(r["transaction"]["amountBaseMinor"], -2_500_000);
        assert_eq!(r["transaction"]["occurredAt"], "2026-10-09T16:36:00");
        assert_eq!(r["llmModel"], "fake-model");
        assert!(r["llmJson"].as_str().unwrap().contains("Kopi Kenangan"));
    }

    #[tokio::test]
    async fn upload_requires_token() {
        let (state, _dir) = test::state(vec![Ok(fake::coffee())]).await;
        let res = app(state).oneshot(upload_req(PNG, "wrong")).await.unwrap();
        assert_eq!(res.status(), 401);
    }

    #[tokio::test]
    async fn upload_rejects_non_images() {
        let (state, _dir) = test::state(vec![Ok(fake::coffee())]).await;
        let res = app(state)
            .oneshot(upload_req(b"hello", test::TOKEN))
            .await
            .unwrap();
        assert_eq!(res.status(), 415);
    }

    #[tokio::test]
    async fn identical_image_is_rejected() {
        let (state, _dir) = test::state(vec![Ok(fake::coffee())]).await;
        let first = upload_ok(&state, PNG).await;
        let res = app(state.clone())
            .oneshot(upload_req(PNG, test::TOKEN))
            .await
            .unwrap();
        assert_eq!(res.status(), 409);
        let v = json(res).await;
        assert_eq!(v["receiptId"], first["id"]);
    }

    #[tokio::test]
    async fn same_bill_in_another_screenshot_is_a_duplicate() {
        let mut later = fake::coffee();
        later.merchant = "KOPI KENANGAN - Sudirman".into();
        later.occurred_at = Some("2026-10-09T16:40".into());
        let (state, _dir) = test::state(vec![Ok(fake::coffee()), Ok(later)]).await;
        let first = upload_ok(&state, PNG).await;
        let second = upload_ok(&state, b"\x89PNG\r\n\x1a\n-another-screenshot").await;
        assert_eq!(second["status"], "duplicate", "{second}");
        assert_eq!(second["duplicateOf"], first["transaction"]["id"]);
        assert!(second["transaction"].is_null());
    }

    #[tokio::test]
    async fn non_receipt_is_rejected() {
        let not = Extraction {
            is_receipt: false,
            ..fake::coffee()
        };
        let (state, _dir) = test::state(vec![Ok(not)]).await;
        let r = upload_ok(&state, PNG).await;
        assert_eq!(r["status"], "rejected");
        assert!(r["transaction"].is_null());
    }

    #[tokio::test]
    async fn usd_is_converted_and_failures_can_be_retried() {
        let usd = Extraction {
            merchant: "Steam".into(),
            currency: "USD".into(),
            total: "12.80".into(),
            category: "entertainment".into(),
            ..fake::coffee()
        };
        let (state, _dir) = test::state(vec![Err("provider down".into()), Ok(usd)]).await;
        let r = upload_ok(&state, PNG).await;
        assert_eq!(r["status"], "failed");
        assert!(r["error"].as_str().unwrap().contains("provider down"));

        let id = r["id"].as_i64().unwrap();
        let res = app(state.clone())
            .oneshot(
                Request::post(format!("/api/receipts/{id}/retry"))
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(res.status(), 202);
        let r = wait_done(&state, id).await;
        assert_eq!(r["status"], "done", "{r}");
        assert_eq!(r["transaction"]["amountMinor"], -1280);
        assert_eq!(r["transaction"]["currency"], "USD");
        // 12.80 USD × 16,000 = Rp 204.800
        assert_eq!(r["transaction"]["amountBaseMinor"], -20_480_000);
    }

    #[tokio::test]
    async fn incoming_transfer_is_income() {
        let transfer = Extraction {
            direction: Direction::In,
            merchant: "PT Klien".into(),
            total: "5.000.000".into(),
            items: vec![],
            category: "food".into(), // inconsistent; coerced to income
            ..fake::coffee()
        };
        let (state, _dir) = test::state(vec![Ok(transfer)]).await;
        let r = upload_ok(&state, PNG).await;
        assert_eq!(r["transaction"]["amountMinor"], 500_000_000);
        assert_eq!(r["transaction"]["categoryId"], "income");
    }

    #[tokio::test]
    async fn image_list_and_delete() {
        let (state, _dir) = test::state(vec![Ok(fake::coffee())]).await;
        let r = upload_ok(&state, PNG).await;
        let id = r["id"].as_i64().unwrap();

        let res = app(state.clone())
            .oneshot(
                Request::get(format!("/api/receipts/{id}/image"))
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(res.headers()["content-type"], "image/png");
        assert_eq!(
            &res.into_body().collect().await.unwrap().to_bytes()[..],
            PNG
        );

        let res = app(state.clone())
            .oneshot(Request::get("/api/receipts").body(Body::empty()).unwrap())
            .await
            .unwrap();
        let list = json(res).await;
        assert_eq!(list.as_array().unwrap().len(), 1);
        assert!(list[0].get("llmJson").is_none());

        let res = app(state.clone())
            .oneshot(
                Request::delete(format!("/api/receipts/{id}"))
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(res.status(), 204);
        // Gone, so the same screenshot can be sent again.
        let res = app(state)
            .oneshot(upload_req(PNG, test::TOKEN))
            .await
            .unwrap();
        assert_eq!(res.status(), 202);
    }
}
