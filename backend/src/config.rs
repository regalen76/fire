use std::path::PathBuf;

use chrono::FixedOffset;

/// Which `response_format` to request from the LLM provider.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum JsonMode {
    /// `json_schema` with `strict: true` (preferred).
    Schema,
    /// Plain `json_object`, for providers without schema support.
    Object,
}

#[derive(Clone, Debug)]
pub struct LlmConfig {
    pub base_url: String,
    pub api_key: String,
    pub model: String,
    pub json_mode: JsonMode,
}

#[derive(Clone, Debug)]
pub struct Config {
    pub database_url: String,
    pub database_token: Option<String>,
    /// `None` disables extraction; uploads then return 503.
    pub llm: Option<LlmConfig>,
    /// `None` disables uploads (503) rather than accepting them unauthenticated.
    pub ingest_token: Option<String>,
    pub base_currency: String,
    pub default_currency: String,
    pub owner_names: Vec<String>,
    /// Owner's timezone; `occurred_at` is stored in this local time.
    pub utc_offset: FixedOffset,
    pub fx_base_url: String,
    pub static_dir: Option<PathBuf>,
}

impl Config {
    pub fn from_env() -> anyhow::Result<Self> {
        let var = |k: &str| std::env::var(k).ok().filter(|v| !v.trim().is_empty());

        let llm = match (
            var("FIRE_LLM_BASE_URL"),
            var("FIRE_LLM_API_KEY"),
            var("FIRE_LLM_MODEL"),
        ) {
            (Some(base_url), Some(api_key), Some(model)) => Some(LlmConfig {
                base_url: base_url.trim_end_matches('/').to_string(),
                api_key,
                model,
                json_mode: match var("FIRE_LLM_JSON_MODE").as_deref() {
                    None | Some("json_schema") => JsonMode::Schema,
                    Some("json_object") => JsonMode::Object,
                    Some(other) => anyhow::bail!(
                        "FIRE_LLM_JSON_MODE must be json_schema or json_object, got {other}"
                    ),
                },
            }),
            (None, None, None) => None,
            _ => anyhow::bail!(
                "set all of FIRE_LLM_BASE_URL, FIRE_LLM_API_KEY and FIRE_LLM_MODEL, or none"
            ),
        };

        let utc_offset = match var("FIRE_UTC_OFFSET") {
            Some(s) => parse_offset(&s)
                .ok_or_else(|| anyhow::anyhow!("FIRE_UTC_OFFSET must look like +07:00"))?,
            None => FixedOffset::east_opt(7 * 3600).unwrap(),
        };

        Ok(Config {
            database_url: var("TURSO_DATABASE_URL").unwrap_or_else(|| "file:fire.db".into()),
            database_token: var("TURSO_AUTH_TOKEN"),
            llm,
            ingest_token: var("FIRE_INGEST_TOKEN"),
            base_currency: var("FIRE_BASE_CURRENCY")
                .unwrap_or_else(|| "IDR".into())
                .to_uppercase(),
            default_currency: var("FIRE_DEFAULT_CURRENCY")
                .unwrap_or_else(|| "IDR".into())
                .to_uppercase(),
            owner_names: var("FIRE_OWNER_NAMES")
                .map(|s| {
                    s.split(',')
                        .map(|n| n.trim().to_string())
                        .filter(|n| !n.is_empty())
                        .collect()
                })
                .unwrap_or_default(),
            utc_offset,
            fx_base_url: var("FIRE_FX_BASE_URL")
                .unwrap_or_else(|| "https://api.frankfurter.dev/v1".into())
                .trim_end_matches('/')
                .to_string(),
            static_dir: var("FIRE_STATIC_DIR").map(PathBuf::from),
        })
    }
}

/// Parses `+07:00`, `-05:30` or `+7`.
fn parse_offset(s: &str) -> Option<FixedOffset> {
    let s = s.trim();
    let (sign, rest) = match s.as_bytes().first()? {
        b'+' => (1, &s[1..]),
        b'-' => (-1, &s[1..]),
        _ => (1, s),
    };
    let (h, m) = rest.split_once(':').unwrap_or((rest, "0"));
    let secs = h.parse::<i32>().ok()? * 3600 + m.parse::<i32>().ok()? * 60;
    FixedOffset::east_opt(sign * secs)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parses_offsets() {
        assert_eq!(parse_offset("+07:00").unwrap().local_minus_utc(), 7 * 3600);
        assert_eq!(parse_offset("-05:30").unwrap().local_minus_utc(), -19800);
        assert_eq!(parse_offset("8").unwrap().local_minus_utc(), 8 * 3600);
        assert!(parse_offset("abc").is_none());
    }
}
