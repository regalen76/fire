#!/usr/bin/env bash
# Installs dependencies in Claude Code cloud sessions only; no-op locally.
[ "$CLAUDE_CODE_REMOTE" = "true" ] || exit 0
set -e
cd "$CLAUDE_PROJECT_DIR"
(cd backend && cargo fetch --quiet)
(cd frontend && npm ci --no-audit --no-fund --loglevel=error)
