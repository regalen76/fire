# Fire

Personal finance web app. A phone sends bill screenshots to the backend, which extracts merchant, line items and category. The web app shows history, spending, income, categories and accounts.

## Layout

- `backend/`: Rust, axum 0.8 + tokio. Entry `src/main.rs`. Serves JSON under `/api/*` on `PORT` (default 3000).
- `frontend/`: React 19 + TypeScript + Vite + Motion (`import { motion } from 'motion/react'`). Dev server proxies `/api` to `localhost:3000`.
- `Design/`: Vision Finance design system (dark navy glass UI). Source of truth for look and feel. Read `Design/readme.md` before UI work.

## Commands

```bash
# backend
cd backend && cargo run            # serve on :3000
cd backend && cargo test
cd backend && cargo clippy -- -D warnings && cargo fmt --check

# frontend
cd frontend && npm run dev         # Vite on :5173
cd frontend && npm run typecheck
cd frontend && npm run build
```

Before finishing a task, run the test/typecheck/build commands for every side you touched.

## Frontend rules

- Use Design components, don't rebuild them: `import { Card } from '@design/components/core/Card'` (no extension; the `.d.ts` next to each `.jsx` gives types). Each component has a `.prompt.md` with usage notes.
- Use CSS tokens from `Design/tokens/*.css` (`var(--blue-500)`, `var(--radius-card)`, `var(--font-sans)`), never hard-coded colours.
- Motion: follow `Design/guidelines/motion.html`. Keep animations short and subtle.
- Copy rules from `Design/readme.md`: Title Case card titles, UPPERCASE buttons, signed amounts (`+$2500` green, `-$2500` muted), no emoji.
- `Design/` is generated; don't edit it unless asked.

## Backend rules

- Routes go in `app()` in `src/main.rs` (split into modules as it grows). JSON fields are camelCase (`#[serde(rename_all = "camelCase")]`).
- Keep `/api/health` working; add a test per new route using `tower::ServiceExt::oneshot`.
- Secrets come from env vars, never committed.

## Cloud sessions

`.claude/hooks/setup.sh` runs on SessionStart and installs deps (`cargo fetch`, `npm ci`) only when `CLAUDE_CODE_REMOTE=true`.
