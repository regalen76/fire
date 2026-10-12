use axum::{extract::State, Json};
use libsql::Connection;
use serde::{Deserialize, Serialize};

use crate::{
    error::{ApiError, ApiResult},
    money,
    state::AppState,
};

const BUDGET_KEY: &str = "monthly_budget_minor";

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Budget {
    /// Monthly spending limit in base minor units; `null` when not set.
    amount_minor: Option<i64>,
    currency: String,
}

pub async fn load_budget(conn: &Connection) -> anyhow::Result<Option<i64>> {
    let mut rows = conn
        .query("SELECT value FROM settings WHERE key = ?1", [BUDGET_KEY])
        .await?;
    Ok(match rows.next().await? {
        Some(row) => row.get::<String>(0)?.parse().ok(),
        None => None,
    })
}

pub async fn get_budget(State(state): State<AppState>) -> ApiResult<Json<Budget>> {
    let conn = state.conn()?;
    Ok(Json(Budget {
        amount_minor: load_budget(&conn).await?,
        currency: state.cfg.base_currency.clone(),
    }))
}

#[derive(Deserialize)]
pub struct PutBudget {
    /// Decimal string in the base currency ("5000000"), or `null` to clear.
    amount: Option<String>,
}

pub async fn put_budget(
    State(state): State<AppState>,
    Json(body): Json<PutBudget>,
) -> ApiResult<Json<Budget>> {
    let conn = state.conn()?;
    match body
        .amount
        .as_deref()
        .map(str::trim)
        .filter(|s| !s.is_empty())
    {
        Some(s) => {
            let minor = money::parse_minor(s)
                .filter(|v| *v > 0)
                .ok_or_else(|| ApiError::BadRequest("amount must be a positive decimal".into()))?;
            conn.execute(
                "INSERT INTO settings (key, value) VALUES (?1, ?2) \
                 ON CONFLICT (key) DO UPDATE SET value = excluded.value",
                (BUDGET_KEY, minor.to_string()),
            )
            .await?;
        }
        None => {
            conn.execute("DELETE FROM settings WHERE key = ?1", [BUDGET_KEY])
                .await?;
        }
    }
    get_budget(State(state)).await
}

#[cfg(test)]
mod tests {
    use axum::{body::Body, http::Request};
    use tower::ServiceExt;

    use crate::{app, llm::fake, routes::receipts::tests::json, state::test};

    fn put(body: &str) -> Request<Body> {
        Request::put("/api/settings/budget")
            .header("content-type", "application/json")
            .body(Body::from(body.to_string()))
            .unwrap()
    }

    #[tokio::test]
    async fn budget_is_optional() {
        let (state, _dir) = test::state(vec![Ok(fake::coffee())]).await;
        let get = || {
            Request::get("/api/settings/budget")
                .body(Body::empty())
                .unwrap()
        };

        let b = json(app(state.clone()).oneshot(get()).await.unwrap()).await;
        assert!(b["amountMinor"].is_null());
        assert_eq!(b["currency"], "IDR");

        let b = json(
            app(state.clone())
                .oneshot(put(r#"{"amount":"5.000.000"}"#))
                .await
                .unwrap(),
        )
        .await;
        assert_eq!(b["amountMinor"], 500_000_000);

        let res = app(state.clone())
            .oneshot(put(r#"{"amount":"0"}"#))
            .await
            .unwrap();
        assert_eq!(res.status(), 400);

        let b = json(
            app(state.clone())
                .oneshot(put(r#"{"amount":null}"#))
                .await
                .unwrap(),
        )
        .await;
        assert!(b["amountMinor"].is_null());
    }
}
