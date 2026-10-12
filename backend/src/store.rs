//! Row types and queries shared by routes and the ingest pipeline.

use libsql::{Connection, Row};
use serde::Serialize;

use crate::llm::Direction;

#[derive(Clone, Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Transaction {
    pub id: i64,
    pub receipt_id: Option<i64>,
    pub category_id: String,
    pub direction: String,
    pub merchant: String,
    pub occurred_at: String,
    pub amount_minor: i64,
    pub currency: String,
    pub amount_base_minor: i64,
    pub fx_rate: f64,
    pub payment_method: Option<String>,
    pub source: String,
    pub note: Option<String>,
    pub created_at: String,
}

pub const TX_COLUMNS: &str = "id, receipt_id, category_id, direction, merchant, occurred_at, \
    amount_minor, currency, amount_base_minor, fx_rate, payment_method, source, note, created_at";

impl Transaction {
    pub fn from_row(row: &Row) -> libsql::Result<Self> {
        Ok(Transaction {
            id: row.get(0)?,
            receipt_id: row.get(1)?,
            category_id: row.get(2)?,
            direction: row.get(3)?,
            merchant: row.get(4)?,
            occurred_at: row.get(5)?,
            amount_minor: row.get(6)?,
            currency: row.get(7)?,
            amount_base_minor: row.get(8)?,
            fx_rate: row.get(9)?,
            payment_method: row.get(10)?,
            source: row.get(11)?,
            note: row.get(12)?,
            created_at: row.get(13)?,
        })
    }
}

#[derive(Clone, Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Item {
    pub name: String,
    pub quantity: Option<f64>,
    pub amount_minor: Option<i64>,
}

/// Everything needed to insert a transaction. Amounts are already signed.
#[derive(Clone, Debug)]
pub struct NewTransaction {
    pub receipt_id: Option<i64>,
    pub category_id: String,
    pub direction: Direction,
    pub merchant: String,
    pub occurred_at: String,
    pub amount_minor: i64,
    pub currency: String,
    pub amount_base_minor: i64,
    pub fx_rate: f64,
    pub payment_method: Option<String>,
    pub source: &'static str,
    pub note: Option<String>,
    pub items: Vec<Item>,
}

/// Inserts the transaction and its items. Run inside a DB transaction when it
/// must be atomic with other writes.
pub async fn insert_transaction(conn: &Connection, t: &NewTransaction) -> anyhow::Result<i64> {
    let mut rows = conn
        .query(
            "INSERT INTO transactions (receipt_id, category_id, direction, merchant, occurred_at, \
             amount_minor, currency, amount_base_minor, fx_rate, payment_method, source, note, created_at) \
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13) RETURNING id",
            libsql::params![
                t.receipt_id,
                t.category_id.as_str(),
                t.direction.as_str(),
                t.merchant.as_str(),
                t.occurred_at.as_str(),
                t.amount_minor,
                t.currency.as_str(),
                t.amount_base_minor,
                t.fx_rate,
                t.payment_method.clone(),
                t.source,
                t.note.clone(),
                chrono::Utc::now().to_rfc3339(),
            ],
        )
        .await?;
    let id: i64 = rows
        .next()
        .await?
        .ok_or_else(|| anyhow::anyhow!("insert returned no id"))?
        .get(0)?;
    drop(rows);
    for item in &t.items {
        conn.execute(
            "INSERT INTO transaction_items (transaction_id, name, quantity, amount_minor) \
             VALUES (?1, ?2, ?3, ?4)",
            (id, item.name.as_str(), item.quantity, item.amount_minor),
        )
        .await?;
    }
    Ok(id)
}

pub async fn get_transaction(conn: &Connection, id: i64) -> anyhow::Result<Option<Transaction>> {
    let mut rows = conn
        .query(
            &format!("SELECT {TX_COLUMNS} FROM transactions WHERE id = ?1"),
            [id],
        )
        .await?;
    match rows.next().await? {
        Some(row) => Ok(Some(Transaction::from_row(&row)?)),
        None => Ok(None),
    }
}

pub async fn get_items(conn: &Connection, transaction_id: i64) -> anyhow::Result<Vec<Item>> {
    let mut rows = conn
        .query(
            "SELECT name, quantity, amount_minor FROM transaction_items \
             WHERE transaction_id = ?1 ORDER BY id",
            [transaction_id],
        )
        .await?;
    let mut items = Vec::new();
    while let Some(row) = rows.next().await? {
        items.push(Item {
            name: row.get(0)?,
            quantity: row.get(1)?,
            amount_minor: row.get(2)?,
        });
    }
    Ok(items)
}

/// Deletes a transaction, its items and the receipt it came from (so the same
/// screenshot can be sent again).
pub async fn delete_transaction(conn: &Connection, id: i64) -> anyhow::Result<bool> {
    let Some(t) = get_transaction(conn, id).await? else {
        return Ok(false);
    };
    let tx = conn.transaction().await?;
    tx.execute(
        "DELETE FROM transaction_items WHERE transaction_id = ?1",
        [id],
    )
    .await?;
    tx.execute("DELETE FROM transactions WHERE id = ?1", [id])
        .await?;
    tx.execute(
        "UPDATE receipts SET duplicate_of = NULL WHERE duplicate_of = ?1",
        [id],
    )
    .await?;
    if let Some(receipt_id) = t.receipt_id {
        tx.execute("DELETE FROM receipts WHERE id = ?1", [receipt_id])
            .await?;
    }
    tx.commit().await?;
    Ok(true)
}

pub async fn category_kind(conn: &Connection, id: &str) -> anyhow::Result<Option<String>> {
    let mut rows = conn
        .query("SELECT kind FROM categories WHERE id = ?1", [id])
        .await?;
    Ok(match rows.next().await? {
        Some(row) => Some(row.get(0)?),
        None => None,
    })
}

/// Keeps category and direction consistent: internal moves are always
/// `transfer`, income can't sit in an expense category and vice versa.
pub fn coerce_category(direction: Direction, category: &str, kind: Option<&str>) -> String {
    match (direction, kind) {
        (Direction::Internal, _) => "transfer".into(),
        (Direction::In, Some("income")) | (Direction::Out, Some("expense")) => category.into(),
        (Direction::In, _) => "income".into(),
        (Direction::Out, _) => "other".into(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn coerces_category_to_direction() {
        assert_eq!(
            coerce_category(Direction::Out, "food", Some("expense")),
            "food"
        );
        assert_eq!(
            coerce_category(Direction::Out, "salary", Some("income")),
            "other"
        );
        assert_eq!(
            coerce_category(Direction::In, "food", Some("expense")),
            "income"
        );
        assert_eq!(
            coerce_category(Direction::In, "salary", Some("income")),
            "salary"
        );
        assert_eq!(
            coerce_category(Direction::Internal, "food", Some("expense")),
            "transfer"
        );
        assert_eq!(coerce_category(Direction::Out, "nope", None), "other");
    }
}
