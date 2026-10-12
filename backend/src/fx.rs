//! Exchange rates into the base currency (IDR), cached per day in `fx_rates`.

use async_trait::async_trait;
use libsql::Connection;
use serde::Deserialize;

#[async_trait]
pub trait FxProvider: Send + Sync {
    /// Units of `base` per one unit of `currency` on `date` (YYYY-MM-DD).
    async fn fetch(&self, date: &str, currency: &str, base: &str) -> anyhow::Result<f64>;
}

/// [Frankfurter](https://frankfurter.dev): free ECB reference rates, includes IDR.
pub struct Frankfurter {
    http: reqwest::Client,
    base_url: String,
}

impl Frankfurter {
    pub fn new(base_url: String) -> Self {
        Self {
            http: reqwest::Client::builder()
                .timeout(std::time::Duration::from_secs(15))
                .build()
                .expect("reqwest client"),
            base_url,
        }
    }
}

#[derive(Deserialize)]
struct FrankfurterResponse {
    rates: std::collections::HashMap<String, f64>,
}

#[async_trait]
impl FxProvider for Frankfurter {
    async fn fetch(&self, date: &str, currency: &str, base: &str) -> anyhow::Result<f64> {
        let url = format!("{}/{date}?base={currency}&symbols={base}", self.base_url);
        let res: FrankfurterResponse = self
            .http
            .get(&url)
            .send()
            .await?
            .error_for_status()?
            .json()
            .await?;
        res.rates
            .get(base)
            .copied()
            .filter(|r| *r > 0.0)
            .ok_or_else(|| anyhow::anyhow!("no {currency}->{base} rate for {date}"))
    }
}

/// Rate for `currency` on `date`, from the cache or the provider.
pub async fn rate(
    conn: &Connection,
    fx: &dyn FxProvider,
    date: &str,
    currency: &str,
    base: &str,
) -> anyhow::Result<f64> {
    if currency == base {
        return Ok(1.0);
    }
    let mut rows = conn
        .query(
            "SELECT rate_to_base FROM fx_rates WHERE date = ?1 AND currency = ?2",
            (date, currency),
        )
        .await?;
    if let Some(row) = rows.next().await? {
        return Ok(row.get::<f64>(0)?);
    }
    let r = fx.fetch(date, currency, base).await?;
    conn.execute(
        "INSERT OR REPLACE INTO fx_rates (date, currency, rate_to_base) VALUES (?1, ?2, ?3)",
        (date, currency, r),
    )
    .await?;
    Ok(r)
}

/// Converts signed minor units with a rate, rounding half away from zero.
pub fn to_base(amount_minor: i64, rate: f64) -> i64 {
    (amount_minor as f64 * rate).round() as i64
}

#[cfg(test)]
pub mod fake {
    use super::*;

    /// 1 USD = 16,000 IDR; anything else fails.
    pub struct FakeFx;

    #[async_trait]
    impl FxProvider for FakeFx {
        async fn fetch(&self, _date: &str, currency: &str, _base: &str) -> anyhow::Result<f64> {
            match currency {
                "USD" => Ok(16_000.0),
                _ => anyhow::bail!("no rate for {currency}"),
            }
        }
    }
}
