# Fire

Personal finance web app. An iPhone Shortcut (on Back Tap) screenshots a bill and POSTs it to the backend. A vision LLM extracts merchant, line items, total and category, and the result is saved in Turso. The web app shows history, spending, income and categories (IDR first, USD supported).

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

- **No separate OCR.** The screenshot goes straight to a vision model on an **OpenAI-compatible** `chat/completions` endpoint (the user runs OpenCode models, not Claude/Anthropic). `FIRE_LLM_BASE_URL`, `FIRE_LLM_API_KEY` and `FIRE_LLM_MODEL` choose the provider, so never hard-code one. Start with `glm-5.3-flash` (vision). Plain `glm-5.3` is text-only. Send the image as a base64 data-URL `image_url` part and request `response_format` `json_schema` (strict). Always re-validate with serde, since compatible providers vary. `category` is an enum of the seeded category ids, so never let the model invent one.
- **LLM client:** `async-openai` 0.42 (feature `chat-completion`) with a custom `api_base`, behind the `Extractor` trait in `llm.rs`. One retry with the validation error appended, then the receipt is `failed` (retry with `POST /api/receipts/:id/retry`). Rig is the alternative if agent features arrive.
- **Async ingest.** `POST /api/receipts` stores the image and a `processing` receipt, returns `202 {id}`, then extracts in `tokio::spawn`. At startup, retry receipts still `processing`. Keep the raw LLM JSON on the receipt row.
- **Turso via the `libsql` crate.** `TURSO_DATABASE_URL` is `libsql://…` remotely and `file:fire.db` locally. Migrations are `.sql` files in `backend/migrations/`, run at startup. Tests use an in-memory or temp-file DB, never the real Turso.
- **Money is integer minor units** (`amount_minor: i64`) plus an ISO currency code. Sign follows direction: `out` < 0, `in` > 0, `internal` > 0 (excluded from totals). Requests take decimal strings parsed by `money::parse_minor`; responses return minor units. Format money only in the frontend (`frontend/src/format.ts`).
- **Ingest auth:** `Authorization: Bearer $FIRE_INGEST_TOKEN`. Compare it in constant time and reject before reading the body.
- **Money:** IDR mostly, with USD for PayPal and some purchases. Keep the original `amount_minor` + `currency`, and also store `amount_base_minor` + `fx_rate` in `FIRE_BASE_CURRENCY` (IDR). Totals and charts use the base amount only. `amount_minor` is ×100 for every currency. Show IDR without decimals (`Rp 25.000`). The model returns decimal strings, and Rust does the conversion.
- **Direction:** every transaction is `in`, `out` or `internal`. Income mostly comes from screenshots of incoming transfers. `FIRE_OWNER_NAMES` tells the model which side of a transfer is the owner. `internal` (own-account moves) is left out of totals.
- **No users, no login, no bank accounts (for now).** Don't add auth screens, a users table or an accounts table unless asked. Skip the prototype's SignIn/Profile/Accounts screens and the account fields. Keep the LLM's free-text `paymentMethod`. Access control is the network: the server is reachable **only over Tailscale** (`tailscale serve` for HTTPS, never `funnel`). Bind to localhost/Tailscale, not `0.0.0.0` on a public interface. `POST /api/receipts` still requires `FIRE_INGEST_TOKEN`.
- **Duplicates are rejected, never saved twice:** an identical image (`image_sha256`) gets `409` before the LLM runs. A different screenshot of the same bill (same direction, currency and amount, similar merchant, within 10 min) gets receipt status `duplicate` + `duplicate_of`, and no transaction.
- **Monthly budget is optional:** one IDR limit in the `settings` table, set from the web app (not an env var). With no budget, the gauge card shows an empty state. Never treat a missing budget as 0.
- Categories come from `Design/ui_kits/finance-web/data.js` (`food, groceries, transport, bills, subs, shopping, salary, transfer`) plus `health, entertainment, other, income`. The README has the table with icons.

## Frontend rules

- Use Design components and don't rebuild them: `import { Card } from '@design/components/core/Card'` (no extension; the `.d.ts` next to each `.jsx` gives the types). Each component has a `.prompt.md` with usage notes.
- The screens to build already exist as a prototype in `Design/ui_kits/finance-web/` (Dashboard, Transactions, Receipts, TransactionDrawer, Shell). Accounts and SignIn are out of scope for now. Port their layout and composition into typed React. Replace `window.FIN_DATA` with API calls and `window.VisionFinanceDesignSystem_*` with `@design/...` imports.
- Use the CSS tokens in `Design/tokens/*.css` (`var(--blue-500)`, `var(--radius-card)`, `var(--font-sans)`); never hard-code colours. Semantic aliases exist: `--income`, `--expense`, `--text-secondary`, `--gradient-row`, `--gradient-card`, `--surface-ghost`.
- Motion: follow `Design/guidelines/motion.html`. Use `--ease-out` `cubic-bezier(0.22,1,0.36,1)`, with `--dur-fast/base/slow` = 150/250/350ms. Keep it short and subtle: no bounce, no press shrink. Hover means brightness 1.12 or a 2px icon nudge.
- Look: cards are glass gradients with no borders and no shadows, radius tokens `--radius-card` 20, `--radius-input`/`--radius-nav` 15, `--radius-button` 12, `--radius-sm` 8 (chips). Dividers are 0.5px `var(--navy-400)`. The sidebar floats 10px from the edge, 264px wide, collapsing to 88px.
- Copy rules from `Design/readme.md`: Title Case card titles, UPPERCASE buttons/overlines/table headers, signed amounts (`+$2500` green, `-$2500` muted), long-form dates ("27 March 2020, at 12:30 PM"), no emoji.
- Icons: `<Icon name="…">` from `@design/components/icons/Icon`. Only the 34 names in `Icon.d.ts` exist.
- Shared frontend pieces: fetch through `api.ts`; get categories, base currency and the refresh signal from `data.tsx` (`useCategories`, `useBaseCurrency`, `useRefresh`, `useAsync`); call `refresh()` after any write so every screen re-fetches. Small widgets the Design system lacks live in `ui.tsx`. Timestamps without an offset are the owner's wall-clock time: format them with `format.ts`, never `new Date(str)`.
- Every screen has loading, empty and error states, and must work at 390px wide (phone: sidebar drawer, tables become lists) with no horizontal page scroll.
- Design bugs are worked around in `frontend/src/index.css` (Material icons painting a solid square, LineChart y-labels misaligned). Remove a workaround once `Design/` is regenerated with the fix.
- `Design/` is generated; don't edit it unless asked. `src/design-shims.d.ts` bridges its pre-React-19 JSX types.

## Backend rules

- Routes are registered in `app()` in `src/main.rs`; handlers live in `src/routes/*.rs`. The README lists every module. JSON fields are camelCase (`#[serde(rename_all = "camelCase")]`). Errors go through `error::ApiError`.
- New schema changes are a new `migrations/000N_*.sql` file added to `MIGRATIONS` in `db.rs`. Never edit an applied migration.
- Open a connection per request with `state.conn()`; wrap multi-statement writes in `conn.transaction()`.
- No CORS layer, on purpose (no login). Don't add one.
- Keep `/api/health` working. Add a test per new route using `tower::ServiceExt::oneshot`, with `state::test::state(...)` (temp DB, `FakeExtractor`, `FakeFx`). Receipt tests use the helpers in `routes::receipts::tests` (`upload_ok`, `wait_done`).
- Put the LLM call behind a trait so tests can use a fake extractor. Tests must never call the real API.
- Secrets come from env vars and are never committed (`.env` is git-ignored). Document each new var in the README's Configuration table.

## Cloud sessions

`.claude/hooks/setup.sh` runs on SessionStart and installs deps (`cargo fetch`, `npm ci`) only when `CLAUDE_CODE_REMOTE=true`.
