# Fire

Personal finance web app. An iPhone Shortcut (on Back Tap) screenshots a bill and POSTs it to the backend. A vision LLM extracts merchant, line items, total and category, and the result is saved in Turso. The web app shows history, spending, income, categories and accounts.

`README.md` holds the full pipeline, the planned schema, the API table, env vars and open questions. Keep it in sync when any of these change (mark API rows `built` as they land).

## Layout

- `backend/`: Rust, axum 0.8 + tokio. Entry `src/main.rs`. Serves JSON under `/api/*` on `PORT` (default 3000).
- `frontend/`: React 19 + TypeScript + Vite + Motion (`import { motion } from 'motion/react'`). The dev server proxies `/api` to `localhost:3000`.
- `Design/`: Vision Finance design system (dark navy glass UI) and the source of truth for look and feel. Read `Design/readme.md` before UI work.

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

## Architecture decisions (see README for the reasoning)

- **No separate OCR.** The screenshot goes straight to a vision model on an **OpenAI-compatible** `chat/completions` endpoint (the user runs OpenCode models, not Claude/Anthropic). `FIRE_LLM_BASE_URL`, `FIRE_LLM_API_KEY` and `FIRE_LLM_MODEL` choose the provider, so never hard-code one. Send the image as a base64 data-URL `image_url` part and request `response_format` `json_schema` (strict). Always re-validate with serde, since compatible providers vary. `category` is an enum of the seeded category ids, so never let the model invent one.
- **LLM client:** `async-openai` with a custom `api_base`, behind an `Extractor` trait in `llm.rs` (proposed; Rig is the alternative if agent features arrive).
- **Async ingest.** `POST /api/receipts` stores the image and a `processing` receipt, returns `202 {id}`, then extracts in `tokio::spawn`. At startup, retry receipts still `processing`. Keep the raw LLM JSON on the receipt row.
- **Turso via the `libsql` crate.** `TURSO_DATABASE_URL` is `libsql://…` remotely and `file:fire.db` locally. Migrations are `.sql` files in `backend/migrations/`, run at startup. Tests use an in-memory or temp-file DB, never the real Turso.
- **Money is integer minor units** (`amount_minor: i64`) plus an ISO currency code. Expenses are negative, income positive, and `transfer` is left out of spending totals. Format money only in the frontend.
- **Ingest auth:** `Authorization: Bearer $FIRE_INGEST_TOKEN`. Compare it in constant time and reject before reading the body.
- Categories come from `Design/ui_kits/finance-web/data.js` (`food, groceries, transport, bills, subs, shopping, salary, transfer`) plus `health, entertainment, other`. The README has the table with icons.

## Frontend rules

- Use Design components and don't rebuild them: `import { Card } from '@design/components/core/Card'` (no extension; the `.d.ts` next to each `.jsx` gives the types). Each component has a `.prompt.md` with usage notes.
- The screens to build already exist as a prototype in `Design/ui_kits/finance-web/` (Dashboard, Transactions, Accounts, Receipts, TransactionDrawer, Shell, SignIn). Port their layout and composition into typed React. Replace `window.FIN_DATA` with API calls and `window.VisionFinanceDesignSystem_*` with `@design/...` imports.
- Use the CSS tokens in `Design/tokens/*.css` (`var(--blue-500)`, `var(--radius-card)`, `var(--font-sans)`); never hard-code colours. Semantic aliases exist: `--income`, `--expense`, `--text-secondary`, `--gradient-row`, `--gradient-card`, `--surface-ghost`.
- Motion: follow `Design/guidelines/motion.html`. Use `--ease-out` `cubic-bezier(0.22,1,0.36,1)`, with `--dur-fast/base/slow` = 150/250/350ms. Keep it short and subtle: no bounce, no press shrink. Hover means brightness 1.12 or a 2px icon nudge.
- Look: cards are glass gradients with no borders and no shadows, radius tokens `--radius-card` 20, `--radius-input`/`--radius-nav` 15, `--radius-button` 12, `--radius-sm` 8 (chips). Dividers are 0.5px `var(--navy-400)`. The sidebar floats 10px from the edge, 264px wide, collapsing to 88px.
- Copy rules from `Design/readme.md`: Title Case card titles, UPPERCASE buttons/overlines/table headers, signed amounts (`+$2500` green, `-$2500` muted), long-form dates ("27 March 2020, at 12:30 PM"), no emoji.
- Icons: `<Icon name="…">` from `@design/components/icons/Icon`. Only the 34 names in `Icon.d.ts` exist.
- `Design/` is generated; don't edit it unless asked. `src/design-shims.d.ts` bridges its pre-React-19 JSX types.

## Backend rules

- Routes go in `app()` in `src/main.rs`. Split into modules (`routes/`, `db.rs`, `llm.rs`) as it grows. JSON fields are camelCase (`#[serde(rename_all = "camelCase")]`).
- Keep `/api/health` working. Add a test per new route using `tower::ServiceExt::oneshot`.
- Put the LLM call behind a trait so tests can use a fake extractor. Tests must never call the real API.
- Secrets come from env vars and are never committed (`.env` is git-ignored). Document each new var in the README's Configuration table.

## Cloud sessions

`.claude/hooks/setup.sh` runs on SessionStart and installs deps (`cargo fetch`, `npm ci`) only when `CLAUDE_CODE_REMOTE=true`.
