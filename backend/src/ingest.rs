//! Background processing of an uploaded screenshot into a transaction.

use chrono::{DateTime, Duration, FixedOffset, NaiveDate, NaiveDateTime};
use libsql::Connection;

use crate::{
    fx,
    llm::{Extraction, PromptContext},
    money,
    state::AppState,
    store::{self, Item, NewTransaction, Transaction, TX_COLUMNS},
};

pub const LOCAL_FMT: &str = "%Y-%m-%dT%H:%M:%S";

/// Same direction, currency and amount within this window counts as the same bill.
const DUPLICATE_WINDOW_MINUTES: i64 = 10;

/// Processes one receipt. Never panics or returns an error: failures are
/// recorded on the receipt row (`status = 'failed'`, `error`).
pub async fn process(state: &AppState, receipt_id: i64) {
    if let Err(e) = process_inner(state, receipt_id).await {
        tracing::warn!(receipt_id, "receipt failed: {e:#}");
        let msg = format!("{e:#}");
        let result = async {
            state
                .conn()?
                .execute(
                    "UPDATE receipts SET status = 'failed', error = ?2, processed_at = ?3 WHERE id = ?1",
                    (receipt_id, msg, chrono::Utc::now().to_rfc3339()),
                )
                .await?;
            anyhow::Ok(())
        }
        .await;
        if let Err(e) = result {
            tracing::error!(receipt_id, "could not mark receipt failed: {e:#}");
        }
    }
}

/// Re-runs receipts left in `processing` by a restart.
pub async fn resume_pending(state: AppState) {
    let ids = async {
        let conn = state.conn()?;
        let mut rows = conn
            .query(
                "SELECT id FROM receipts WHERE status = 'processing' ORDER BY id",
                (),
            )
            .await?;
        let mut ids = Vec::new();
        while let Some(row) = rows.next().await? {
            ids.push(row.get::<i64>(0)?);
        }
        anyhow::Ok(ids)
    }
    .await;
    match ids {
        Ok(ids) => {
            if !ids.is_empty() {
                tracing::info!("resuming {} pending receipt(s)", ids.len());
            }
            for id in ids {
                process(&state, id).await;
            }
        }
        Err(e) => tracing::error!("could not list pending receipts: {e:#}"),
    }
}

async fn process_inner(state: &AppState, receipt_id: i64) -> anyhow::Result<()> {
    let extractor = state
        .extractor
        .clone()
        .ok_or_else(|| anyhow::anyhow!("no LLM configured"))?;
    let conn = state.conn()?;

    // Scoped so the row and its statement are gone before the writes below: a
    // live row keeps a read snapshot open, and upgrading it to a write fails at
    // once (SQLITE_BUSY_SNAPSHOT) if another ingest committed in the meantime.
    let (image, mime, created_at) = {
        let mut rows = conn
            .query(
                "SELECT image, mime, created_at FROM receipts WHERE id = ?1",
                [receipt_id],
            )
            .await?;
        let row = rows
            .next()
            .await?
            .ok_or_else(|| anyhow::anyhow!("receipt {receipt_id} not found"))?;
        (
            row.get::<Vec<u8>>(0)?,
            row.get::<String>(1)?,
            row.get::<String>(2)?,
        )
    };

    let uploaded_local =
        DateTime::parse_from_rfc3339(&created_at)?.with_timezone(&state.cfg.utc_offset);
    let ctx = PromptContext {
        owner_names: state.cfg.owner_names.clone(),
        default_currency: state.cfg.default_currency.clone(),
        base_currency: state.cfg.base_currency.clone(),
        today: uploaded_local.format("%Y-%m-%d").to_string(),
    };

    let out = extractor.extract(&image, &mime, &ctx).await?;
    conn.execute(
        "UPDATE receipts SET llm_model = ?2, llm_json = ?3 WHERE id = ?1",
        (receipt_id, extractor.model(), out.raw.as_str()),
    )
    .await?;

    let ex = out.extraction;
    if !ex.is_receipt {
        finish(
            &conn,
            receipt_id,
            "rejected",
            Some("not a receipt or transfer"),
            None,
        )
        .await?;
        return Ok(());
    }

    let new = build_transaction(state, &conn, receipt_id, &ex, uploaded_local).await?;

    if let Some(existing) = find_duplicate(&conn, &new).await? {
        finish(
            &conn,
            receipt_id,
            "duplicate",
            Some(&format!(
                "same as transaction {} ({} on {})",
                existing.id, existing.merchant, existing.occurred_at
            )),
            Some(existing.id),
        )
        .await?;
        return Ok(());
    }

    let tx = conn.transaction().await?;
    store::insert_transaction(&tx, &new).await?;
    finish(&tx, receipt_id, "done", None, None).await?;
    tx.commit().await?;
    Ok(())
}

async fn finish(
    conn: &Connection,
    receipt_id: i64,
    status: &str,
    error: Option<&str>,
    duplicate_of: Option<i64>,
) -> anyhow::Result<()> {
    conn.execute(
        "UPDATE receipts SET status = ?2, error = ?3, duplicate_of = ?4, processed_at = ?5 WHERE id = ?1",
        (
            receipt_id,
            status,
            error,
            duplicate_of,
            chrono::Utc::now().to_rfc3339(),
        ),
    )
    .await?;
    Ok(())
}

async fn build_transaction(
    state: &AppState,
    conn: &Connection,
    receipt_id: i64,
    ex: &Extraction,
    uploaded_local: DateTime<FixedOffset>,
) -> anyhow::Result<NewTransaction> {
    let cfg = &state.cfg;
    let total = money::parse_minor(&ex.total)
        .filter(|v| *v > 0)
        .ok_or_else(|| anyhow::anyhow!("invalid total {:?}", ex.total))?;
    let amount_minor = total * ex.direction.sign();

    let occurred_at = occurred_at(ex.occurred_at.as_deref(), uploaded_local);
    let date = &occurred_at[..10];

    let (amount_base_minor, fx_rate) = if ex.currency == cfg.base_currency {
        (amount_minor, 1.0)
    } else if let Some(base) = ex
        .base_currency_total
        .as_deref()
        .and_then(money::parse_minor)
        .filter(|v| *v > 0)
    {
        // The screenshot showed the converted amount (e.g. PayPal), so trust it.
        (base * ex.direction.sign(), base as f64 / total as f64)
    } else {
        let rate = fx::rate(
            conn,
            state.fx.as_ref(),
            date,
            &ex.currency,
            &cfg.base_currency,
        )
        .await
        .map_err(|e| anyhow::anyhow!("exchange rate unavailable: {e:#}"))?;
        (fx::to_base(amount_minor, rate), rate)
    };

    let kind = store::category_kind(conn, &ex.category).await?;
    let category_id = store::coerce_category(ex.direction, &ex.category, kind.as_deref());

    let items = ex
        .items
        .iter()
        .filter(|i| !i.name.trim().is_empty())
        .map(|i| Item {
            name: i.name.trim().to_string(),
            quantity: i.quantity,
            amount_minor: i.amount.as_deref().and_then(money::parse_minor),
        })
        .collect();

    Ok(NewTransaction {
        receipt_id: Some(receipt_id),
        category_id,
        direction: ex.direction,
        merchant: ex.merchant.trim().to_string(),
        occurred_at,
        amount_minor,
        currency: ex.currency.clone(),
        amount_base_minor,
        fx_rate,
        payment_method: ex
            .payment_method
            .as_ref()
            .map(|p| p.trim().to_string())
            .filter(|p| !p.is_empty()),
        source: "receipt",
        note: None,
        items,
    })
}

/// The time shown on the screenshot, or the upload time if it's missing,
/// unparseable or implausibly in the future.
pub fn occurred_at(shown: Option<&str>, uploaded_local: DateTime<FixedOffset>) -> String {
    let fallback = uploaded_local.naive_local();
    let parsed = shown.and_then(parse_local);
    match parsed {
        Some(t) if t <= fallback + Duration::days(1) => t,
        _ => fallback,
    }
    .format(LOCAL_FMT)
    .to_string()
}

pub fn parse_local(s: &str) -> Option<NaiveDateTime> {
    let s = s.trim();
    for fmt in [
        "%Y-%m-%dT%H:%M:%S",
        "%Y-%m-%dT%H:%M",
        "%Y-%m-%d %H:%M:%S",
        "%Y-%m-%d %H:%M",
    ] {
        if let Ok(t) = NaiveDateTime::parse_from_str(s, fmt) {
            return Some(t);
        }
    }
    NaiveDate::parse_from_str(s, "%Y-%m-%d")
        .ok()
        .and_then(|d| d.and_hms_opt(0, 0, 0))
}

async fn find_duplicate(
    conn: &Connection,
    new: &NewTransaction,
) -> anyhow::Result<Option<Transaction>> {
    let t = NaiveDateTime::parse_from_str(&new.occurred_at, LOCAL_FMT)?;
    let window = Duration::minutes(DUPLICATE_WINDOW_MINUTES);
    let mut rows = conn
        .query(
            &format!(
                "SELECT {TX_COLUMNS} FROM transactions WHERE direction = ?1 AND currency = ?2 \
                 AND amount_minor = ?3 AND occurred_at BETWEEN ?4 AND ?5"
            ),
            (
                new.direction.as_str(),
                new.currency.as_str(),
                new.amount_minor,
                (t - window).format(LOCAL_FMT).to_string(),
                (t + window).format(LOCAL_FMT).to_string(),
            ),
        )
        .await?;
    while let Some(row) = rows.next().await? {
        let existing = Transaction::from_row(&row)?;
        if similar_merchant(&existing.merchant, &new.merchant) {
            return Ok(Some(existing));
        }
    }
    Ok(None)
}

/// "KOPI KENANGAN - Sudirman" ~ "Kopi Kenangan".
fn similar_merchant(a: &str, b: &str) -> bool {
    let norm = |s: &str| -> String {
        s.chars()
            .filter(|c| c.is_alphanumeric())
            .flat_map(char::to_lowercase)
            .collect()
    };
    let (a, b) = (norm(a), norm(b));
    a.is_empty() || b.is_empty() || a.contains(&b) || b.contains(&a)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn local(s: &str) -> DateTime<FixedOffset> {
        DateTime::parse_from_rfc3339(s).unwrap()
    }

    #[test]
    fn occurred_at_falls_back_to_upload_time() {
        let up = local("2026-10-09T17:00:00+07:00");
        assert_eq!(
            occurred_at(Some("2026-10-09T16:36"), up),
            "2026-10-09T16:36:00"
        );
        assert_eq!(occurred_at(Some("2026-10-09"), up), "2026-10-09T00:00:00");
        assert_eq!(occurred_at(None, up), "2026-10-09T17:00:00");
        assert_eq!(occurred_at(Some("yesterday"), up), "2026-10-09T17:00:00");
        assert_eq!(
            occurred_at(Some("2027-01-01T10:00"), up),
            "2026-10-09T17:00:00"
        );
    }

    #[test]
    fn merchant_similarity() {
        assert!(similar_merchant(
            "KOPI KENANGAN - Sudirman",
            "Kopi Kenangan"
        ));
        assert!(similar_merchant("Tokopedia", "tokopedia"));
        assert!(!similar_merchant("Tokopedia", "Shopee"));
    }
}
