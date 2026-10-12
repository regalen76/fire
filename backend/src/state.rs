use std::sync::Arc;

use chrono::{DateTime, FixedOffset, Utc};
use libsql::{Connection, Database};

use crate::{config::Config, fx::FxProvider, llm::Extractor};

#[derive(Clone)]
pub struct AppState {
    pub db: Arc<Database>,
    pub cfg: Arc<Config>,
    /// `None` when no LLM is configured; uploads are refused.
    pub extractor: Option<Arc<dyn Extractor>>,
    pub fx: Arc<dyn FxProvider>,
}

impl AppState {
    pub fn conn(&self) -> anyhow::Result<Connection> {
        crate::db::connect(&self.db)
    }

    /// Current time in the owner's timezone.
    pub fn now_local(&self) -> DateTime<FixedOffset> {
        Utc::now().with_timezone(&self.cfg.utc_offset)
    }
}

#[cfg(test)]
pub mod test {
    use super::*;
    use crate::{
        config::Config,
        fx::fake::FakeFx,
        llm::{fake::FakeExtractor, Extraction},
    };

    pub const TOKEN: &str = "test-token";

    /// A state backed by a fresh temp-file database. Keep the `TempDir` alive.
    pub async fn state(results: Vec<Result<Extraction, String>>) -> (AppState, tempfile::TempDir) {
        let dir = tempfile::tempdir().unwrap();
        let cfg = Config {
            database_url: format!("file:{}", dir.path().join("test.db").display()),
            database_token: None,
            llm: None,
            ingest_token: Some(TOKEN.into()),
            base_currency: "IDR".into(),
            default_currency: "IDR".into(),
            owner_names: vec!["Test Owner".into()],
            utc_offset: FixedOffset::east_opt(7 * 3600).unwrap(),
            fx_base_url: String::new(),
            static_dir: None,
        };
        let db = crate::db::open(&cfg).await.unwrap();
        let state = AppState {
            db: Arc::new(db),
            cfg: Arc::new(cfg),
            extractor: Some(Arc::new(FakeExtractor::new(results))),
            fx: Arc::new(FakeFx),
        };
        (state, dir)
    }
}
