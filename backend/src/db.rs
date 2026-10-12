use std::time::Duration;

use libsql::{Builder, Connection, Database};

use crate::config::Config;

/// Migrations run in order at startup; each is applied once and recorded in `_migrations`.
const MIGRATIONS: &[(&str, &str)] = &[("0001_init", include_str!("../migrations/0001_init.sql"))];

pub async fn open(cfg: &Config) -> anyhow::Result<Database> {
    let url = cfg.database_url.as_str();
    let db = if url.starts_with("libsql://") || url.starts_with("https://") {
        let token = cfg
            .database_token
            .clone()
            .ok_or_else(|| anyhow::anyhow!("TURSO_AUTH_TOKEN is required for {url}"))?;
        Builder::new_remote(url.to_string(), token).build().await?
    } else {
        let path = url.strip_prefix("file:").unwrap_or(url);
        let db = Builder::new_local(path).build().await?;
        // WAL lets the web app read while a receipt is being saved.
        db.connect()?.query("PRAGMA journal_mode = WAL", ()).await?;
        db
    };
    migrate(&db.connect()?).await?;
    Ok(db)
}

/// A fresh connection per request: cheap for both local files and Turso, and it
/// keeps one task's transaction from interleaving with another's statements.
pub fn connect(db: &Database) -> anyhow::Result<Connection> {
    let conn = db.connect()?;
    // Remote connections don't support busy_timeout; local ones need it.
    let _ = conn.busy_timeout(Duration::from_secs(5));
    Ok(conn)
}

async fn migrate(conn: &Connection) -> anyhow::Result<()> {
    conn.execute(
        "CREATE TABLE IF NOT EXISTS _migrations (name TEXT PRIMARY KEY, applied_at TEXT NOT NULL)",
        (),
    )
    .await?;
    for (name, sql) in MIGRATIONS {
        let mut rows = conn
            .query("SELECT 1 FROM _migrations WHERE name = ?1", [*name])
            .await?;
        if rows.next().await?.is_some() {
            continue;
        }
        let tx = conn.transaction().await?;
        tx.execute_batch(sql).await?;
        tx.execute(
            "INSERT INTO _migrations (name, applied_at) VALUES (?1, ?2)",
            (*name, chrono::Utc::now().to_rfc3339()),
        )
        .await?;
        tx.commit().await?;
        tracing::info!("applied migration {name}");
    }
    Ok(())
}
