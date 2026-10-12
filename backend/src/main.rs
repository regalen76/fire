mod config;
mod db;
mod error;
mod fx;
mod ingest;
mod llm;
mod money;
mod routes;
mod state;
mod store;

use std::{
    net::{IpAddr, Ipv4Addr, SocketAddr},
    sync::Arc,
};

use axum::{
    extract::DefaultBodyLimit,
    routing::{get, post},
    Json, Router,
};
use serde::Serialize;
use tower_http::{
    services::{ServeDir, ServeFile},
    trace::TraceLayer,
};

use crate::{
    error::ApiError,
    routes::{receipts, reports, settings, transactions},
    state::AppState,
};

/// iPhone screenshots are a few MB as PNG; leave headroom.
const MAX_UPLOAD_BYTES: usize = 25 * 1024 * 1024;

#[derive(Serialize)]
struct Health {
    status: &'static str,
}

async fn health() -> Json<Health> {
    Json(Health { status: "ok" })
}

// No CORS layer on purpose: there is no login, so other origins must not be
// able to read the API from the owner's browser. The Vite dev server proxies.
fn app(state: AppState) -> Router {
    let api = Router::new()
        .route("/health", get(health))
        .route("/categories", get(reports::categories))
        .route("/summary", get(reports::summary))
        .route("/cashflow", get(reports::cashflow))
        .route(
            "/receipts",
            get(receipts::list)
                .post(receipts::upload)
                .layer(DefaultBodyLimit::max(MAX_UPLOAD_BYTES)),
        )
        .route(
            "/receipts/{id}",
            get(receipts::get).delete(receipts::delete),
        )
        .route("/receipts/{id}/image", get(receipts::image))
        .route("/receipts/{id}/retry", post(receipts::retry))
        .route(
            "/transactions",
            get(transactions::list).post(transactions::create),
        )
        .route(
            "/transactions/{id}",
            get(transactions::get)
                .patch(transactions::patch)
                .delete(transactions::delete),
        )
        .route(
            "/settings/budget",
            get(settings::get_budget).put(settings::put_budget),
        )
        .fallback(|| async { ApiError::NotFound });

    let mut router = Router::new().nest("/api", api);
    if let Some(dir) = state.cfg.static_dir.clone() {
        // Built frontend; unknown paths fall back to index.html for client routing.
        router = router
            .fallback_service(ServeDir::new(&dir).fallback(ServeFile::new(dir.join("index.html"))));
    }
    router.with_state(state).layer(TraceLayer::new_for_http())
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Local convenience; on the server use real env vars (systemd EnvironmentFile).
    let _ = dotenvy::dotenv();
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env().unwrap_or_else(|_| "info".into()),
        )
        .init();

    let cfg = config::Config::from_env()?;
    if cfg.ingest_token.is_none() {
        tracing::warn!("FIRE_INGEST_TOKEN is not set: uploads are disabled");
    }
    let extractor: Option<Arc<dyn llm::Extractor>> = match cfg.llm.clone() {
        Some(llm_cfg) => {
            tracing::info!(model = %llm_cfg.model, base = %llm_cfg.base_url, "LLM configured");
            Some(Arc::new(llm::OpenAiExtractor::new(llm_cfg)))
        }
        None => {
            tracing::warn!("FIRE_LLM_* is not set: uploads are disabled");
            None
        }
    };
    let db = db::open(&cfg).await?;
    let state = AppState {
        db: Arc::new(db),
        fx: Arc::new(fx::Frankfurter::new(cfg.fx_base_url.clone())),
        cfg: Arc::new(cfg),
        extractor,
    };
    if state.extractor.is_some() {
        tokio::spawn(ingest::resume_pending(state.clone()));
    }

    let port: u16 = std::env::var("PORT")
        .ok()
        .and_then(|p| p.parse().ok())
        .unwrap_or(3000);
    // Localhost by default: `tailscale serve` proxies the tailnet to it, and nothing should be public.
    let host: IpAddr = std::env::var("HOST")
        .ok()
        .and_then(|h| h.parse().ok())
        .unwrap_or(IpAddr::V4(Ipv4Addr::LOCALHOST));
    let addr = SocketAddr::new(host, port);
    let listener = tokio::net::TcpListener::bind(addr).await?;
    tracing::info!("listening on {addr}");
    axum::serve(listener, app(state)).await?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum::{body::Body, http::Request};
    use http_body_util::BodyExt;
    use tower::ServiceExt;

    #[tokio::test]
    async fn health_returns_ok() {
        let (state, _dir) = state::test::state(vec![Ok(llm::fake::coffee())]).await;
        let res = app(state)
            .oneshot(Request::get("/api/health").body(Body::empty()).unwrap())
            .await
            .unwrap();
        assert!(res.status().is_success());
        let body = res.into_body().collect().await.unwrap().to_bytes();
        assert_eq!(&body[..], br#"{"status":"ok"}"#);
    }

    #[tokio::test]
    async fn serves_the_built_frontend() {
        let (mut state, dir) = state::test::state(vec![Ok(llm::fake::coffee())]).await;
        let dist = dir.path().join("dist");
        std::fs::create_dir_all(dist.join("assets")).unwrap();
        std::fs::write(dist.join("index.html"), "<html>fire</html>").unwrap();
        std::fs::write(dist.join("assets/app.js"), "console.log(1)").unwrap();
        let mut cfg = (*state.cfg).clone();
        cfg.static_dir = Some(dist);
        state.cfg = Arc::new(cfg);

        let get = |path: &str| {
            app(state.clone()).oneshot(Request::get(path).body(Body::empty()).unwrap())
        };
        let res = get("/").await.unwrap();
        assert_eq!(res.status(), 200);
        let body = res.into_body().collect().await.unwrap().to_bytes();
        assert_eq!(&body[..], b"<html>fire</html>");
        assert_eq!(get("/assets/app.js").await.unwrap().status(), 200);
        // Unknown paths get the app with 200, so a reload never shows an error page.
        assert_eq!(get("/transactions").await.unwrap().status(), 200);
        // The API keeps its JSON 404 and is not swallowed by the fallback.
        assert_eq!(get("/api/nope").await.unwrap().status(), 404);
        assert!(get("/api/health").await.unwrap().status().is_success());
    }

    #[tokio::test]
    async fn unknown_api_route_is_json_404() {
        let (state, _dir) = state::test::state(vec![Ok(llm::fake::coffee())]).await;
        let res = app(state)
            .oneshot(Request::get("/api/nope").body(Body::empty()).unwrap())
            .await
            .unwrap();
        assert_eq!(res.status(), 404);
    }
}
