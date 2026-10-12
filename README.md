# Fire

A personal finance app built around one gesture: **double-tap the back of the iPhone** while a bill, receipt or payment confirmation is on screen. Fire saves the merchant, line items, total and category, and the web app turns them into a financial report.

> Status: scaffold. The backend serves `/api/health` and a placeholder `/api/summary`. The React app renders one card with the Design components. Everything under [Pipeline](#pipeline) is the agreed plan, not built yet. [Open questions](#open-questions) lists what still needs a decision.

## Pipeline

```
iPhone                         Backend (Rust / axum)                          Turso (libSQL)
──────                         ─────────────────────                          ──────────────
Back Tap (double)
  └─ Shortcut
       1. Take Screenshot
       2. POST /api/receipts  ──▶ auth (bearer token)
          multipart "image"       store image + receipt row (status=processing) ──▶ receipts
                              ◀── 202 { id }
       3. Show notification       background task:
                                    vision LLM: image → JSON
                                    (merchant, date, total, currency,
                                     items[], category, payment hint)
                                    validate + save                        ──▶ transactions,
                                    status=done | failed                         transaction_items
Web app (React)  ── GET /api/* ──▶ read and aggregate                       ◀── queries
```

### 1. Capture: iOS Shortcut + Back Tap

1. In **Shortcuts**, create a shortcut named "Send to Fire":
   - **Take Screenshot**
   - **Get Contents of URL**
     - URL: `https://<your-host>/api/receipts`
     - Method: `POST`
     - Headers: `Authorization: Bearer <FIRE_INGEST_TOKEN>`
     - Request Body: `Form`, with a field `image` (type File) set to the screenshot
   - **Show Notification** with the response (e.g. "Receipt received").
2. Go to **Settings → Accessibility → Touch → Back Tap → Double Tap** and choose "Send to Fire".

Back Tap runs the shortcut on top of whatever app is open, so the screenshot shows the bill itself. The endpoint must be public **HTTPS**, because iOS blocks plain HTTP.

### 2. Extraction: vision LLM, no separate OCR step

**Decision (proposed): send the image directly to a vision-capable LLM and get structured JSON back.** A classic OCR stage is skipped.

| Option | What it does | Verdict |
|---|---|---|
| **Vision LLM with structured output** | One call reads the image, extracts fields and picks a category from a fixed list | **Chosen.** Screenshots are clean digital text, which these models read reliably. One call replaces OCR, parsing and categorising. It copes with any layout or language (e.g. e-wallet and bank-app receipts) without per-merchant rules. |
| OCR (Tesseract / cloud OCR) → LLM on text | Two stages | More moving parts. Layout is lost (which number is the total?) and it still needs an LLM to categorise. |
| On-device OCR in the Shortcut ("Extract Text from Image") → send text | iPhone does OCR | Cheaper and the image never leaves the phone, but it loses layout and the original image for re-processing. Not needed, since vision models are available. |
| OCR + regex/rules only | No LLM | Brittle: every receipt format needs its own rules, and categorising stays manual. |

Implementation notes:
- **Provider: any OpenAI-compatible endpoint** (OpenCode or anything else that speaks `POST {base}/chat/completions`). Three env vars choose it: `FIRE_LLM_BASE_URL`, `FIRE_LLM_API_KEY` and `FIRE_LLM_MODEL`. Changing provider or model is a config change, not a code change.
- The model **must accept image input** (vision). The image goes in as an `image_url` content part holding a `data:image/png;base64,…` URL. **Starting model: `glm-5.3-flash`** (natively multimodal and available on the user's plan). Plain `glm-5.3` is text-only, so don't use it here. Vision models such as Qwen-VL are also available. Compare a few on real receipts, then keep the best.
- The output is constrained with `response_format: {type: "json_schema", strict: true}`. Not every OpenAI-compatible provider honours that, so the backend always validates the reply with serde anyway. If validation fails, it retries once with the error appended and then marks the receipt `failed`. `FIRE_LLM_JSON_MODE=json_object` falls back to plain JSON mode for providers without schema support.
- **Client library (proposed): [`async-openai`](https://crates.io/crates/async-openai)** with a custom `api_base`, behind our own `Extractor` trait (`fn extract(&self, image: &[u8], mime: &str) -> Result<Extraction>`). It is a typed client for exactly this API with no extra layers, and it allows a fake extractor in tests. [Rig](https://rig.rs) is a reasonable alternative and becomes the better fit if Fire later grows agent features, such as a "chat with your spending" assistant with tools over the DB. For one image-in, JSON-out call it adds abstraction and a fast-moving API without much benefit. Because of the trait, switching later only touches `llm.rs`.
- `category` is an **enum** in the schema (see [Categories](#categories)), so the model cannot invent new ones.
- Keep the raw model JSON on the receipt row. A bad extraction can then be debugged or re-run without re-sending the image.
- If the image isn't a bill (a random screenshot), the model returns `isReceipt: false` and the receipt is marked `rejected`.

### 3. Processing model: async

The Shortcut should get an answer within about a second, but an LLM call takes several seconds. The endpoint therefore stores the image, inserts a `processing` receipt, returns `202 { id }` and processes it in a `tokio::spawn` task. This matches the "Processing" card on the Receipts screen in the design. If the process restarts mid-extraction, any receipt still `processing` at startup is retried.

### 4. Storage: Turso

- Rust crate `libsql`. It connects to Turso remotely (`TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN`) or to a local SQLite file in dev (`TURSO_DATABASE_URL=file:fire.db`).
- Migrations are plain `.sql` files under `backend/migrations/`, applied at startup.
- **Money is stored as integer minor units** (`amount_minor`) plus an ISO currency code. Floats are never used. Expenses are negative and income positive.
- Images go in a `BLOB` column for now: personal volume is small and it keeps everything in one place. They can move to object storage (R2/S3) later if size becomes a problem.

Planned schema:

```sql
accounts          (id, name, bank, type, last4, currency, created_at)
categories        (id TEXT PRIMARY KEY, label, icon, kind)            -- kind: expense|income|transfer
receipts          (id, status, image BLOB, mime, llm_json, error,     -- status: processing|done|failed|rejected
                   created_at, processed_at)
transactions      (id, receipt_id NULL, account_id NULL, category_id,
                   merchant, occurred_at, amount_minor, currency,
                   source, note, created_at)                          -- source: receipt|manual|bank
transaction_items (id, transaction_id, name, quantity, amount_minor)
```

### 5. Web app

Built with the Vision Finance design system in `Design/`. The click-through prototype in `Design/ui_kits/finance-web/` defines the screens to build:

| Screen | Content | Main API |
|---|---|---|
| Dashboard | KPI stat cards (balance, month income, month spending, receipts scanned), welcome card, monthly budget gauge, cash-flow line chart, spending-by-category bars, recent transactions, balances by account | `GET /api/summary`, `/api/cashflow`, `/api/transactions?limit=5` |
| Transactions | Table filterable by All / Income / Outcome and by category | `GET /api/transactions` |
| Accounts | Card visual, balance, linked accounts, per-account activity | `GET /api/accounts`, `/api/transactions?account=` |
| Receipts | Processing queue (live), scanned history, "How it works" | `GET /api/receipts` |
| Transaction drawer | Detail with items read from the receipt, edit category, delete | `GET/PATCH/DELETE /api/transactions/:id` |

## Categories

Seeded from the design's mock data (`Design/ui_kits/finance-web/data.js`). The LLM must choose one of these ids.

| id | Label | Kind | Icon |
|---|---|---|---|
| `food` | Food & Dining | expense | `IONIconCCartDefault` |
| `groceries` | Groceries | expense | `IONIconCCubeDefault` |
| `transport` | Transport | expense | `IONIconRRocketSharp` |
| `bills` | Bills & Utilities | expense | `Domain` |
| `subs` | Subscriptions | expense | `IONIconDDocumentsDefault` |
| `shopping` | Shopping | expense | `IONIconCCardDefault` |
| `health` | Health | expense | (to pick) |
| `entertainment` | Entertainment | expense | (to pick) |
| `other` | Other | expense | (to pick) |
| `salary` | Salary | income | `IONIconWWalletDefault` |
| `transfer` | Transfer | transfer | `IONIconKKeyDefault` |

`transfer` is left out of spending totals. `health`, `entertainment` and `other` are additions to the design's list.

## API

| Method | Path | Status | Notes |
|---|---|---|---|
| GET | `/api/health` | built | `{"status":"ok"}` |
| GET | `/api/summary` | placeholder | Hard-coded stat cards |
| POST | `/api/receipts` | planned | Multipart `image`, bearer `FIRE_INGEST_TOKEN`, returns `202 {id}` |
| GET | `/api/receipts` | planned | Queue and history |
| GET | `/api/receipts/:id/image` | planned | Original screenshot |
| GET | `/api/transactions` | planned | `?type=in\|out&category=&account=&from=&to=&limit=` |
| GET/PATCH/DELETE | `/api/transactions/:id` | planned | PATCH for category/account fixes |
| GET | `/api/accounts` | planned | With computed balances |
| GET | `/api/cashflow` | planned | Monthly income/expense series |

JSON fields are camelCase.

## Configuration

All configuration comes from environment variables. Put them in `backend/.env` locally (git-ignored); never commit them.

| Var | Purpose | Default |
|---|---|---|
| `PORT` | HTTP port | `3000` |
| `RUST_LOG` | Log filter | `info` |
| `TURSO_DATABASE_URL` | `libsql://…turso.io` or `file:fire.db` | planned |
| `TURSO_AUTH_TOKEN` | Turso token (remote only) | planned |
| `FIRE_LLM_BASE_URL` | OpenAI-compatible base URL (the part before `/chat/completions`) | planned |
| `FIRE_LLM_API_KEY` | API key for that provider | planned |
| `FIRE_LLM_MODEL` | Vision-capable model id | `glm-5.3-flash` (planned) |
| `FIRE_LLM_JSON_MODE` | `json_schema` or `json_object` | `json_schema` (planned) |
| `FIRE_INGEST_TOKEN` | Shared secret the Shortcut sends | planned |
| `FIRE_DEFAULT_CURRENCY` | Used when the receipt shows no currency | planned |

## Development

```bash
# backend (Rust, axum 0.8)
cd backend && cargo run                               # :3000
cd backend && cargo test
cd backend && cargo clippy -- -D warnings && cargo fmt --check

# frontend (React 19 + TS + Vite + Motion)
cd frontend && npm install
cd frontend && npm run dev                            # :5173, proxies /api → :3000
cd frontend && npm run typecheck && npm run build
```

To test ingestion without a phone (once the route exists):

```bash
curl -X POST localhost:3000/api/receipts \
  -H "Authorization: Bearer $FIRE_INGEST_TOKEN" \
  -F image=@receipt.png
```

## Repository layout

```
backend/    Rust API (axum + tokio). Entry: src/main.rs
frontend/   React app. Imports Design components via the @design alias
Design/     Vision Finance design system (generated; source of truth for UI)
  readme.md            visual + copy rules — read first
  tokens/*.css         colours, type, spacing, motion tokens
  components/          React components (.jsx + .d.ts + .prompt.md)
  ui_kits/finance-web/ click-through prototype of every screen
.claude/    Claude Code settings + cloud-session setup hook
```

## Open questions

1. **Hosting.** The Shortcut needs public HTTPS. Options are a small VPS or PaaS (Fly.io, Railway, Render) or a Cloudflare Tunnel to a home machine. The frontend can be served by the backend or hosted separately.
2. **Currency.** The design shows `$`. Which currency or currencies will the receipts be in? This decides `FIRE_DEFAULT_CURRENCY` and money formatting (e.g. IDR has no minor unit in practice).
3. **Accounts.** How should a receipt map to an account? Options: the LLM reads the payment method or card last-4 and matches it to `accounts.last4`, a default account, or set by hand in the drawer.
4. **Income.** Receipts are mostly expenses. Is income entered manually, read from screenshots of transfer confirmations or payslips, or imported from bank statements later?
5. **Web auth.** The ingest endpoint uses a bearer token. The web app needs login too (single user: a password plus a session cookie is probably enough).
6. **LLM model.** Start with `glm-5.3-flash`. Compare it with the Qwen vision models on 10–20 real receipts (merchant, total and category correct?) before settling on one.
7. **Duplicates.** Tapping twice on the same bill should not create two transactions. Proposed fix: hash the image and also match on merchant + total + time.
