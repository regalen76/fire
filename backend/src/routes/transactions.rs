use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    Json,
};
use libsql::Value;
use serde::{Deserialize, Serialize};

use crate::{
    error::{ApiError, ApiResult},
    fx,
    ingest::{parse_local, LOCAL_FMT},
    llm::Direction,
    money,
    state::AppState,
    store::{self, Item, NewTransaction, Transaction, TX_COLUMNS},
};

#[derive(Deserialize)]
pub struct ListQuery {
    direction: Option<String>,
    category: Option<String>,
    currency: Option<String>,
    /// Inclusive local date, YYYY-MM-DD.
    from: Option<String>,
    /// Inclusive local date, YYYY-MM-DD.
    to: Option<String>,
    /// Substring of the merchant name.
    q: Option<String>,
    limit: Option<i64>,
    offset: Option<i64>,
}

#[derive(Serialize)]
pub struct Page {
    items: Vec<Transaction>,
    total: i64,
}

pub async fn list(
    State(state): State<AppState>,
    Query(q): Query<ListQuery>,
) -> ApiResult<Json<Page>> {
    let mut clauses = Vec::new();
    let mut params: Vec<Value> = Vec::new();
    let mut push = |clause: &str, v: Value| {
        params.push(v);
        clauses.push(clause.replace('?', &format!("?{}", params.len())));
    };
    if let Some(d) = q.direction.as_deref() {
        Direction::parse(d)
            .ok_or_else(|| ApiError::BadRequest("direction must be in, out or internal".into()))?;
        push("direction = ?", d.into());
    }
    if let Some(c) = q.category {
        push("category_id = ?", c.into());
    }
    if let Some(c) = q.currency {
        push("currency = ?", c.to_uppercase().into());
    }
    if let Some(from) = q.from.as_deref() {
        check_date(from)?;
        push("occurred_at >= ?", format!("{from}T00:00:00").into());
    }
    if let Some(to) = q.to.as_deref() {
        check_date(to)?;
        push("occurred_at <= ?", format!("{to}T23:59:59").into());
    }
    if let Some(s) = q.q.as_deref().map(str::trim).filter(|s| !s.is_empty()) {
        push("merchant LIKE ?", format!("%{s}%").into());
    }
    let where_sql = if clauses.is_empty() {
        String::new()
    } else {
        format!("WHERE {}", clauses.join(" AND "))
    };

    let conn = state.conn()?;
    let mut rows = conn
        .query(
            &format!("SELECT COUNT(*) FROM transactions {where_sql}"),
            params.clone(),
        )
        .await?;
    let total: i64 = rows
        .next()
        .await?
        .map(|r| r.get(0))
        .transpose()?
        .unwrap_or(0);
    drop(rows);

    let n = params.len();
    params.push(q.limit.unwrap_or(50).clamp(1, 500).into());
    params.push(q.offset.unwrap_or(0).max(0).into());
    let mut rows = conn
        .query(
            &format!(
                "SELECT {TX_COLUMNS} FROM transactions {where_sql} \
                 ORDER BY occurred_at DESC, id DESC LIMIT ?{} OFFSET ?{}",
                n + 1,
                n + 2
            ),
            params,
        )
        .await?;
    let mut items = Vec::new();
    while let Some(row) = rows.next().await? {
        items.push(Transaction::from_row(&row)?);
    }
    Ok(Json(Page { items, total }))
}

fn check_date(s: &str) -> ApiResult<()> {
    chrono::NaiveDate::parse_from_str(s, "%Y-%m-%d")
        .map(|_| ())
        .map_err(|_| ApiError::BadRequest(format!("dates must be YYYY-MM-DD, got {s:?}")))
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Detail {
    #[serde(flatten)]
    transaction: Transaction,
    items: Vec<Item>,
}

pub async fn get(State(state): State<AppState>, Path(id): Path<i64>) -> ApiResult<Json<Detail>> {
    let conn = state.conn()?;
    let transaction = store::get_transaction(&conn, id)
        .await?
        .ok_or(ApiError::NotFound)?;
    let items = store::get_items(&conn, id).await?;
    Ok(Json(Detail { transaction, items }))
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateBody {
    direction: Direction,
    merchant: String,
    /// Positive decimal string, e.g. "5000000" or "12.80".
    amount: String,
    currency: Option<String>,
    category_id: String,
    /// Local time; defaults to now.
    occurred_at: Option<String>,
    payment_method: Option<String>,
    note: Option<String>,
}

/// Manual entry, mainly for income without a screenshot.
pub async fn create(
    State(state): State<AppState>,
    Json(body): Json<CreateBody>,
) -> ApiResult<(StatusCode, Json<Detail>)> {
    let cfg = &state.cfg;
    let merchant = body.merchant.trim().to_string();
    if merchant.is_empty() {
        return Err(ApiError::BadRequest("merchant must not be empty".into()));
    }
    let amount = money::parse_minor(&body.amount)
        .filter(|v| *v > 0)
        .ok_or_else(|| ApiError::BadRequest("amount must be a positive decimal".into()))?;
    let currency = body
        .currency
        .map(|c| c.trim().to_uppercase())
        .unwrap_or_else(|| cfg.default_currency.clone());
    if currency.len() != 3 || !currency.bytes().all(|b| b.is_ascii_uppercase()) {
        return Err(ApiError::BadRequest(
            "currency must be an ISO code like IDR".into(),
        ));
    }
    let occurred_at = match body.occurred_at.as_deref() {
        Some(s) => parse_local(s)
            .ok_or_else(|| ApiError::BadRequest("occurredAt must be YYYY-MM-DDTHH:MM".into()))?,
        None => state.now_local().naive_local(),
    }
    .format(LOCAL_FMT)
    .to_string();

    let conn = state.conn()?;
    check_category(&conn, body.direction, &body.category_id).await?;

    let amount_minor = amount * body.direction.sign();
    let rate = fx::rate(
        &conn,
        state.fx.as_ref(),
        &occurred_at[..10],
        &currency,
        &cfg.base_currency,
    )
    .await
    .map_err(|e| ApiError::Unavailable(format!("exchange rate unavailable: {e:#}")))?;

    let new = NewTransaction {
        receipt_id: None,
        category_id: body.category_id,
        direction: body.direction,
        merchant,
        occurred_at,
        amount_minor,
        currency,
        amount_base_minor: fx::to_base(amount_minor, rate),
        fx_rate: rate,
        payment_method: body.payment_method.filter(|s| !s.trim().is_empty()),
        source: "manual",
        note: body.note.filter(|s| !s.trim().is_empty()),
        items: vec![],
    };
    let id = store::insert_transaction(&conn, &new).await?;
    let transaction = store::get_transaction(&conn, id)
        .await?
        .ok_or(ApiError::NotFound)?;
    Ok((
        StatusCode::CREATED,
        Json(Detail {
            transaction,
            items: vec![],
        }),
    ))
}

/// Rejects unknown categories and ones that don't match the direction.
async fn check_category(
    conn: &libsql::Connection,
    direction: Direction,
    category: &str,
) -> ApiResult<()> {
    let kind = store::category_kind(conn, category)
        .await?
        .ok_or_else(|| ApiError::BadRequest(format!("unknown category {category:?}")))?;
    if store::coerce_category(direction, category, Some(&kind)) != category {
        return Err(ApiError::BadRequest(format!(
            "category {category:?} ({kind}) doesn't fit direction {:?}",
            direction.as_str()
        )));
    }
    Ok(())
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PatchBody {
    category_id: Option<String>,
    direction: Option<Direction>,
    merchant: Option<String>,
    occurred_at: Option<String>,
    /// Empty string clears it.
    note: Option<String>,
}

/// Fixes what the model got wrong. Changing direction flips the sign; if the
/// category no longer fits, it's moved to the closest one unless one was given.
pub async fn patch(
    State(state): State<AppState>,
    Path(id): Path<i64>,
    Json(body): Json<PatchBody>,
) -> ApiResult<Json<Detail>> {
    let conn = state.conn()?;
    let t = store::get_transaction(&conn, id)
        .await?
        .ok_or(ApiError::NotFound)?;
    let old_direction =
        Direction::parse(&t.direction).ok_or_else(|| anyhow::anyhow!("bad direction in db"))?;
    let direction = body.direction.unwrap_or(old_direction);

    let category = match body.category_id {
        Some(c) => {
            check_category(&conn, direction, &c).await?;
            c
        }
        None => {
            let kind = store::category_kind(&conn, &t.category_id).await?;
            store::coerce_category(direction, &t.category_id, kind.as_deref())
        }
    };
    let merchant = match body.merchant {
        Some(m) if m.trim().is_empty() => {
            return Err(ApiError::BadRequest("merchant must not be empty".into()))
        }
        Some(m) => m.trim().to_string(),
        None => t.merchant,
    };
    let occurred_at = match body.occurred_at.as_deref() {
        Some(s) => parse_local(s)
            .ok_or_else(|| ApiError::BadRequest("occurredAt must be YYYY-MM-DDTHH:MM".into()))?
            .format(LOCAL_FMT)
            .to_string(),
        None => t.occurred_at,
    };
    let note = match body.note {
        Some(n) if n.trim().is_empty() => None,
        Some(n) => Some(n),
        None => t.note,
    };
    let sign = direction.sign();

    conn.execute(
        "UPDATE transactions SET category_id = ?2, direction = ?3, merchant = ?4, occurred_at = ?5, \
         note = ?6, amount_minor = ?7, amount_base_minor = ?8 WHERE id = ?1",
        libsql::params![
            id,
            category,
            direction.as_str(),
            merchant,
            occurred_at,
            note,
            t.amount_minor.abs() * sign,
            t.amount_base_minor.abs() * sign,
        ],
    )
    .await?;
    get(State(state), Path(id)).await
}

pub async fn delete(State(state): State<AppState>, Path(id): Path<i64>) -> ApiResult<StatusCode> {
    let conn = state.conn()?;
    if store::delete_transaction(&conn, id).await? {
        Ok(StatusCode::NO_CONTENT)
    } else {
        Err(ApiError::NotFound)
    }
}

#[cfg(test)]
mod tests {
    use axum::{body::Body, http::Request};
    use serde_json::json;
    use tower::ServiceExt;

    use crate::{
        app,
        llm::fake,
        routes::receipts::tests::{json, upload_ok, PNG},
        state::{test, AppState},
    };

    async fn send(
        state: &AppState,
        method: &str,
        uri: &str,
        body: Option<serde_json::Value>,
    ) -> (u16, serde_json::Value) {
        let req = Request::builder().method(method).uri(uri);
        let req = match body {
            Some(b) => req
                .header("content-type", "application/json")
                .body(Body::from(b.to_string()))
                .unwrap(),
            None => req.body(Body::empty()).unwrap(),
        };
        let res = app(state.clone()).oneshot(req).await.unwrap();
        let status = res.status().as_u16();
        let v = if status == 204 {
            json!(null)
        } else {
            json(res).await
        };
        (status, v)
    }

    #[tokio::test]
    async fn manual_income_list_patch_delete() {
        let (state, _dir) = test::state(vec![Ok(fake::coffee())]).await;
        upload_ok(&state, PNG).await;

        let (s, created) = send(
            &state,
            "POST",
            "/api/transactions",
            Some(json!({
                "direction": "in", "merchant": "PayPal client", "amount": "100",
                "currency": "usd", "categoryId": "income", "occurredAt": "2026-10-10T09:00"
            })),
        )
        .await;
        assert_eq!(s, 201, "{created}");
        assert_eq!(created["amountMinor"], 10_000);
        assert_eq!(created["amountBaseMinor"], 160_000_000);
        assert_eq!(created["source"], "manual");

        let (_, page) = send(&state, "GET", "/api/transactions", None).await;
        assert_eq!(page["total"], 2);
        assert_eq!(page["items"][0]["merchant"], "PayPal client");

        let (_, page) = send(
            &state,
            "GET",
            "/api/transactions?direction=out&from=2026-10-09&to=2026-10-09",
            None,
        )
        .await;
        assert_eq!(page["total"], 1);
        assert_eq!(page["items"][0]["merchant"], "Kopi Kenangan");

        let coffee_id = page["items"][0]["id"].as_i64().unwrap();
        let (_, detail) = send(
            &state,
            "GET",
            &format!("/api/transactions/{coffee_id}"),
            None,
        )
        .await;
        assert_eq!(detail["items"][0]["name"], "Kopi Susu");

        // Wrongly read as an expense: flip to internal; category follows.
        let (s, patched) = send(
            &state,
            "PATCH",
            &format!("/api/transactions/{coffee_id}"),
            Some(json!({ "direction": "internal" })),
        )
        .await;
        assert_eq!(s, 200, "{patched}");
        assert_eq!(patched["categoryId"], "transfer");
        assert_eq!(patched["amountMinor"], 2_500_000);

        let (s, err) = send(
            &state,
            "PATCH",
            &format!("/api/transactions/{coffee_id}"),
            Some(json!({ "direction": "out", "categoryId": "salary" })),
        )
        .await;
        assert_eq!(s, 400, "{err}");

        let (s, _) = send(
            &state,
            "DELETE",
            &format!("/api/transactions/{coffee_id}"),
            None,
        )
        .await;
        assert_eq!(s, 204);
        let (_, receipts) = send(&state, "GET", "/api/receipts", None).await;
        assert_eq!(receipts.as_array().unwrap().len(), 0);
    }

    #[tokio::test]
    async fn create_validates_input() {
        let (state, _dir) = test::state(vec![Ok(fake::coffee())]).await;
        for body in [
            json!({ "direction": "in", "merchant": "", "amount": "1", "categoryId": "income" }),
            json!({ "direction": "in", "merchant": "x", "amount": "-1", "categoryId": "income" }),
            json!({ "direction": "in", "merchant": "x", "amount": "1", "categoryId": "food" }),
            json!({ "direction": "in", "merchant": "x", "amount": "1", "categoryId": "nope" }),
        ] {
            let (s, _) = send(&state, "POST", "/api/transactions", Some(body)).await;
            assert_eq!(s, 400);
        }
    }
}
