# Fire: one image with the Rust API and the built web app.
#   docker build -t fire .
#   docker compose -f deploy/compose.yml up -d
# The container listens on 0.0.0.0:3000 inside its own network namespace; publish it
# to 127.0.0.1 only and let `tailscale serve` put it on the tailnet. Never publish it
# on a public interface: Fire has no login.

FROM node:22-bookworm-slim AS web
WORKDIR /src
COPY Design ./Design
COPY frontend/package.json frontend/package-lock.json ./frontend/
RUN cd frontend && npm ci
COPY frontend ./frontend
RUN cd frontend && npm run build

FROM rust:1.97-bookworm AS api
WORKDIR /src/backend
COPY backend/Cargo.toml backend/Cargo.lock ./
# Cache dependencies separately from our code.
RUN mkdir src && echo 'fn main() {}' > src/main.rs && cargo build --release --locked && rm -rf src
COPY backend ./
RUN touch src/main.rs && cargo build --release --locked

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && useradd --system --uid 10001 --home /data fire \
    && mkdir /data && chown fire /data
COPY --from=api /src/backend/target/release/fire-backend /usr/local/bin/fire-backend
COPY --from=web /src/frontend/dist /app/dist
ENV HOST=0.0.0.0 \
    PORT=3000 \
    FIRE_STATIC_DIR=/app/dist \
    TURSO_DATABASE_URL=file:/data/fire.db
USER fire
WORKDIR /data
VOLUME /data
EXPOSE 3000
CMD ["fire-backend"]
