use std::net::{IpAddr, Ipv4Addr, SocketAddr};

use axum::{routing::get, Json, Router};
use serde::Serialize;
use tower_http::{cors::CorsLayer, trace::TraceLayer};

#[derive(Serialize)]
struct Health {
    status: &'static str,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct Stat {
    label: &'static str,
    value: &'static str,
    change: &'static str,
}

async fn health() -> Json<Health> {
    Json(Health { status: "ok" })
}

// Placeholder data until the receipt-parsing service is wired in.
async fn summary() -> Json<Vec<Stat>> {
    Json(vec![
        Stat {
            label: "Balance",
            value: "$53,000",
            change: "+55%",
        },
        Stat {
            label: "Income",
            value: "$8,200",
            change: "+5%",
        },
        Stat {
            label: "Spending",
            value: "$3,052",
            change: "-14%",
        },
        Stat {
            label: "Receipts",
            value: "173",
            change: "+8%",
        },
    ])
}

fn app() -> Router {
    Router::new()
        .route("/api/health", get(health))
        .route("/api/summary", get(summary))
        .layer(CorsLayer::permissive())
        .layer(TraceLayer::new_for_http())
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env().unwrap_or_else(|_| "info".into()),
        )
        .init();

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
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    tracing::info!("listening on {addr}");
    axum::serve(listener, app()).await.unwrap();
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum::{body::Body, http::Request};
    use http_body_util::BodyExt;
    use tower::ServiceExt;

    #[tokio::test]
    async fn health_returns_ok() {
        let res = app()
            .oneshot(Request::get("/api/health").body(Body::empty()).unwrap())
            .await
            .unwrap();
        assert!(res.status().is_success());
        let body = res.into_body().collect().await.unwrap().to_bytes();
        assert_eq!(&body[..], br#"{"status":"ok"}"#);
    }
}
