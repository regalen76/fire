use axum::{
    extract::{Query, State},
    Json,
};
use chrono::{Datelike, NaiveDate};
use libsql::Connection;
use serde::{Deserialize, Serialize};

use crate::{
    error::{ApiError, ApiResult},
    routes::settings::load_budget,
    state::AppState,
};

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Category {
    id: String,
    label: String,
    icon: String,
    kind: String,
}

pub async fn categories(State(state): State<AppState>) -> ApiResult<Json<Vec<Category>>> {
    let conn = state.conn()?;
    let mut rows = conn
        .query(
            "SELECT id, label, icon, kind FROM categories ORDER BY rowid",
            (),
        )
        .await?;
    let mut out = Vec::new();
    while let Some(row) = rows.next().await? {
        out.push(Category {
            id: row.get(0)?,
            label: row.get(1)?,
            icon: row.get(2)?,
            kind: row.get(3)?,
        });
    }
    Ok(Json(out))
}

#[derive(Deserialize)]
pub struct MonthQuery {
    /// YYYY-MM; defaults to the current local month.
    month: Option<String>,
}

#[derive(Serialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct Totals {
    income_minor: i64,
    /// Positive number: money spent.
    spending_minor: i64,
    net_minor: i64,
    transaction_count: i64,
    receipt_count: i64,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CategorySpend {
    category_id: String,
    spending_minor: i64,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Summary {
    month: String,
    base_currency: String,
    #[serde(flatten)]
    totals: Totals,
    /// Same totals for the month before, for "+12%" style deltas.
    previous: Totals,
    by_category: Vec<CategorySpend>,
    /// Monthly budget in base minor units, `null` when not set.
    budget_minor: Option<i64>,
}

/// Dashboard numbers for one month, in the base currency. `internal` moves are excluded.
pub async fn summary(
    State(state): State<AppState>,
    Query(q): Query<MonthQuery>,
) -> ApiResult<Json<Summary>> {
    let first = match q.month.as_deref() {
        Some(m) => NaiveDate::parse_from_str(&format!("{m}-01"), "%Y-%m-%d")
            .map_err(|_| ApiError::BadRequest("month must be YYYY-MM".into()))?,
        None => state.now_local().date_naive().with_day(1).unwrap(),
    };
    let prev = first
        .checked_sub_months(chrono::Months::new(1))
        .ok_or_else(|| ApiError::BadRequest("month out of range".into()))?;
    let next = first
        .checked_add_months(chrono::Months::new(1))
        .ok_or_else(|| ApiError::BadRequest("month out of range".into()))?;

    let conn = state.conn()?;
    let totals = totals_between(&conn, first, next).await?;
    let previous = totals_between(&conn, prev, first).await?;

    let mut rows = conn
        .query(
            "SELECT category_id, SUM(-amount_base_minor) FROM transactions \
             WHERE direction = 'out' AND occurred_at >= ?1 AND occurred_at < ?2 \
             GROUP BY category_id ORDER BY 2 DESC",
            (bound(first), bound(next)),
        )
        .await?;
    let mut by_category = Vec::new();
    while let Some(row) = rows.next().await? {
        by_category.push(CategorySpend {
            category_id: row.get(0)?,
            spending_minor: row.get(1)?,
        });
    }

    Ok(Json(Summary {
        month: first.format("%Y-%m").to_string(),
        base_currency: state.cfg.base_currency.clone(),
        totals,
        previous,
        by_category,
        budget_minor: load_budget(&conn).await?,
    }))
}

fn bound(d: NaiveDate) -> String {
    format!("{}T00:00:00", d.format("%Y-%m-%d"))
}

async fn totals_between(
    conn: &Connection,
    from: NaiveDate,
    to: NaiveDate,
) -> anyhow::Result<Totals> {
    let mut rows = conn
        .query(
            "SELECT \
               COALESCE(SUM(CASE WHEN direction = 'in' THEN amount_base_minor END), 0), \
               COALESCE(SUM(CASE WHEN direction = 'out' THEN -amount_base_minor END), 0), \
               COUNT(*), \
               COALESCE(SUM(source = 'receipt'), 0) \
             FROM transactions WHERE occurred_at >= ?1 AND occurred_at < ?2",
            (bound(from), bound(to)),
        )
        .await?;
    let Some(row) = rows.next().await? else {
        return Ok(Totals::default());
    };
    let income: i64 = row.get(0)?;
    let spending: i64 = row.get(1)?;
    Ok(Totals {
        income_minor: income,
        spending_minor: spending,
        net_minor: income - spending,
        transaction_count: row.get(2)?,
        receipt_count: row.get(3)?,
    })
}

#[derive(Deserialize)]
pub struct YearQuery {
    year: Option<i32>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MonthFlow {
    month: String,
    income_minor: i64,
    spending_minor: i64,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Cashflow {
    year: i32,
    base_currency: String,
    months: Vec<MonthFlow>,
}

/// Monthly income and spending for a year, all 12 months present.
pub async fn cashflow(
    State(state): State<AppState>,
    Query(q): Query<YearQuery>,
) -> ApiResult<Json<Cashflow>> {
    let year = q.year.unwrap_or_else(|| state.now_local().year());
    let conn = state.conn()?;
    let mut rows = conn
        .query(
            "SELECT substr(occurred_at, 1, 7), \
               COALESCE(SUM(CASE WHEN direction = 'in' THEN amount_base_minor END), 0), \
               COALESCE(SUM(CASE WHEN direction = 'out' THEN -amount_base_minor END), 0) \
             FROM transactions WHERE occurred_at >= ?1 AND occurred_at < ?2 \
             GROUP BY 1",
            (
                format!("{year:04}-01-01T00:00:00"),
                format!("{:04}-01-01T00:00:00", year + 1),
            ),
        )
        .await?;
    let mut months: Vec<MonthFlow> = (1..=12)
        .map(|m| MonthFlow {
            month: format!("{year:04}-{m:02}"),
            income_minor: 0,
            spending_minor: 0,
        })
        .collect();
    while let Some(row) = rows.next().await? {
        let key: String = row.get(0)?;
        if let Some(m) = months.iter_mut().find(|m| m.month == key) {
            m.income_minor = row.get(1)?;
            m.spending_minor = row.get(2)?;
        }
    }
    Ok(Json(Cashflow {
        year,
        base_currency: state.cfg.base_currency.clone(),
        months,
    }))
}

#[cfg(test)]
mod tests {
    use axum::{body::Body, http::Request};
    use tower::ServiceExt;

    use crate::{
        app,
        llm::{fake, Direction, Extraction},
        routes::receipts::tests::{json, upload_ok, PNG},
        state::test,
    };

    #[tokio::test]
    async fn summary_and_cashflow() {
        let salary = Extraction {
            direction: Direction::In,
            merchant: "PT Employer".into(),
            total: "10000000".into(),
            items: vec![],
            category: "salary".into(),
            occurred_at: Some("2026-10-01T09:00".into()),
            ..fake::coffee()
        };
        let topup = Extraction {
            direction: Direction::Internal,
            merchant: "GoPay top-up".into(),
            total: "500000".into(),
            items: vec![],
            category: "transfer".into(),
            ..fake::coffee()
        };
        let (state, _dir) = test::state(vec![Ok(fake::coffee()), Ok(salary), Ok(topup)]).await;
        upload_ok(&state, PNG).await;
        upload_ok(&state, b"\x89PNG\r\n\x1a\nsalary").await;
        upload_ok(&state, b"\x89PNG\r\n\x1a\ntopup").await;

        let res = app(state.clone())
            .oneshot(
                Request::get("/api/summary?month=2026-10")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();
        let s = json(res).await;
        assert_eq!(s["incomeMinor"], 1_000_000_000);
        assert_eq!(s["spendingMinor"], 2_500_000);
        assert_eq!(s["netMinor"], 997_500_000);
        assert_eq!(s["transactionCount"], 3);
        assert_eq!(s["receiptCount"], 3);
        assert_eq!(s["previous"]["incomeMinor"], 0);
        assert_eq!(s["byCategory"][0]["categoryId"], "food");
        assert!(s["budgetMinor"].is_null());

        let res = app(state.clone())
            .oneshot(
                Request::get("/api/cashflow?year=2026")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();
        let c = json(res).await;
        assert_eq!(c["months"].as_array().unwrap().len(), 12);
        assert_eq!(c["months"][9]["month"], "2026-10");
        assert_eq!(c["months"][9]["spendingMinor"], 2_500_000);

        let res = app(state)
            .oneshot(Request::get("/api/categories").body(Body::empty()).unwrap())
            .await
            .unwrap();
        let cats = json(res).await;
        assert_eq!(cats.as_array().unwrap().len(), 12);
        assert_eq!(cats[0]["id"], "food");
    }
}
