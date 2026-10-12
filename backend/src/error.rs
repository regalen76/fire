use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use serde_json::json;

/// API errors, rendered as `{"error": "..."}` (plus extra fields for conflicts).
#[derive(Debug)]
pub enum ApiError {
    BadRequest(String),
    Unauthorized,
    NotFound,
    Conflict(serde_json::Value),
    UnsupportedMedia(String),
    Unavailable(String),
    Internal(anyhow::Error),
}

pub type ApiResult<T> = Result<T, ApiError>;

impl<E: Into<anyhow::Error>> From<E> for ApiError {
    fn from(e: E) -> Self {
        ApiError::Internal(e.into())
    }
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        let (status, body) = match self {
            ApiError::BadRequest(m) => (StatusCode::BAD_REQUEST, json!({ "error": m })),
            ApiError::Unauthorized => {
                (StatusCode::UNAUTHORIZED, json!({ "error": "unauthorized" }))
            }
            ApiError::NotFound => (StatusCode::NOT_FOUND, json!({ "error": "not found" })),
            ApiError::Conflict(v) => (StatusCode::CONFLICT, v),
            ApiError::UnsupportedMedia(m) => {
                (StatusCode::UNSUPPORTED_MEDIA_TYPE, json!({ "error": m }))
            }
            ApiError::Unavailable(m) => (StatusCode::SERVICE_UNAVAILABLE, json!({ "error": m })),
            ApiError::Internal(e) => {
                tracing::error!("internal error: {e:#}");
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    json!({ "error": "internal error" }),
                )
            }
        };
        (status, Json(body)).into_response()
    }
}
