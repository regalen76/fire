# Fire

A personal finance app built around one gesture: **double-tap the back of the iPhone** while a bill, receipt or payment confirmation is on screen. Fire saves the merchant, line items, total and category, and the web app turns them into a financial report.

> Status: scaffold. The backend serves `/api/health` and a placeholder `/api/summary`. The React app renders one card with the Design components. Everything under [Pipeline](#pipeline) is the agreed plan, not built yet.

## Decisions so far

| Topic | Decision |
|---|---|
| Extraction | Vision LLM reads the screenshot directly (no OCR step) through an OpenAI-compatible endpoint. Starting model is `glm-5.3-flash`. |
| Currency | Mostly **IDR** (bank). **USD** for PayPal and some purchases. Each transaction keeps its original currency, and reports are totalled in IDR. |
| Income | Mainly from **screenshots of incoming transfers**. Manual entry is also possible. |
| Users / login | **None.** Single owner, no login or register. The web app must therefore not be public (see [Deployment](#deployment)). |
| Bank accounts | **Not modelled yet.** No accounts table and no Accounts screen. The LLM records a free-text `paymentMethod` (e.g. "BCA", "GoPay", "PayPal") so accounts can be added later. |
| Hosting | The owner's own server, reachable **only over Tailscale**. Nothing is exposed to the public internet. |

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
                                    (direction, merchant/counterparty, date,
                                     total, currency, items[], category,
                                     paymentMethod)
                                    validate + save                        ──▶ transactions,
                                    status=done | failed                         transaction_items
Web app (React)  ── GET /api/* ──▶ read and aggregate                       ◀── queries
```

### 1. Capture: iOS Shortcut + Back Tap

1. In **Shortcuts**, create a shortcut named "Send to Fire":
   - **Take Screenshot**
   - **Get Contents of URL**
     - URL: `https://<server>.<tailnet>.ts.net/api/receipts`
     - Method: `POST`
     - Headers: `Authorization: Bearer <FIRE_INGEST_TOKEN>`
     - Request Body: `Form`, with a field `image` (type File) set to the screenshot
   - **Show Notification** with the response (e.g. "Receipt received").
2. Go to **Settings → Accessibility → Touch → Back Tap → Double Tap** and choose "Send to Fire".

Back Tap runs the shortcut on top of whatever app is open, so the screenshot shows the bill itself. The phone must be connected to Tailscale when the shortcut runs. Turn on the Tailscale app's **VPN On Demand** (or keep it always connected) so a Back Tap never fails silently. If the upload can't reach the server, the Shortcut shows an error notification; Shortcuts has no offline retry queue.

### 2. Extraction: vision LLM, no separate OCR step

**Decision: send the image directly to a vision-capable LLM and get structured JSON back.** A classic OCR stage is skipped.

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
- If the image isn't a bill or transfer (a random screenshot), the model returns `isReceipt: false` and the receipt is marked `rejected`.
- **Indonesian number formats.** `Rp 25.000` means twenty-five thousand (`.` separates thousands, `,` marks decimals). The prompt says so explicitly, and the model returns amounts as decimal strings (`"25000.00"`) that the backend converts to integers. The model never does that maths itself.

### Expenses, income and transfers

The same shortcut handles purchase receipts and bank or e-wallet transfer confirmations (e.g. "Transfer Berhasil"). The model returns a `direction`:

| `direction` | Meaning | Sign | Example |
|---|---|---|---|
| `out` | Money left the owner | negative | Restaurant bill, QRIS payment, transfer to someone else |
| `in` | Money came to the owner | positive | Salary or client payment received |
| `internal` | Between the owner's own accounts | excluded from totals | BCA → GoPay top-up, PayPal → bank withdrawal |

A transfer screenshot looks the same whether the owner sent or received it, so the prompt includes the owner's names as they appear on bank and e-wallet accounts (`FIRE_OWNER_NAMES`). If the owner is the recipient, the direction is `in`. If both sides are the owner, it is `internal`. Income is usually a salary or a client payment, so incoming transfers default to `income` and are fixed in the drawer when needed.

### 3. Processing model: async

The Shortcut should get an answer within about a second, but an LLM call takes several seconds. The endpoint therefore stores the image, inserts a `processing` receipt, returns `202 { id }` and processes it in a `tokio::spawn` task. This matches the "Processing" card on the Receipts screen in the design. If the process restarts mid-extraction, any receipt still `processing` at startup is retried.

### 4. Storage: Turso

- Rust crate `libsql`. It connects to Turso remotely (`TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN`) or to a local SQLite file in dev (`TURSO_DATABASE_URL=file:fire.db`).
- Migrations are plain `.sql` files under `backend/migrations/`, applied at startup.
- **Money is stored as integer minor units** (`amount_minor`, ×100 for every currency, so `Rp 25.000` → `2500000` and `$12.80` → `1280`) plus an ISO currency code. Floats are never used. Expenses are negative and income positive. IDR is displayed without decimals.
- **Multi-currency.** Every transaction also stores `amount_base_minor` in the base currency (`FIRE_BASE_CURRENCY=IDR`) and the `fx_rate` used, fixed at the time the transaction is saved. All totals, charts and budgets use the base amount. The original amount is shown next to it (e.g. `-Rp 205.000 · -$12.80`). Rate source, in order:
  1. the screenshot itself, if it shows a conversion (PayPal often does);
  2. the daily rate for the transaction date from a free FX API (e.g. [Frankfurter](https://frankfurter.dev), ECB data, includes IDR), cached in an `fx_rates` table.
- Images go in a `BLOB` column for now: personal volume is small and it keeps everything in one place. They can move to object storage (R2/S3) later if size becomes a problem.

Planned schema:

```sql
categories        (id TEXT PRIMARY KEY, label, icon, kind)            -- kind: expense|income|internal
receipts          (id, status, image BLOB, mime, image_sha256 UNIQUE, -- status: processing|done|failed|rejected
                   llm_model, llm_json, error, created_at, processed_at)
transactions      (id, receipt_id NULL, category_id, direction,       -- direction: in|out|internal
                   merchant, occurred_at, amount_minor, currency,
                   amount_base_minor, fx_rate, payment_method NULL,
                   source, note, created_at)                          -- source: receipt|manual
transaction_items (id, transaction_id, name, quantity, amount_minor)
fx_rates          (date, currency, rate_to_base, PRIMARY KEY (date, currency))
```

### 5. Web app

Built with the Vision Finance design system in `Design/`. The click-through prototype in `Design/ui_kits/finance-web/` defines the screens to build:

| Screen | Content | Main API |
|---|---|---|
| Dashboard | KPI stat cards (month net, month income, month spending, receipts scanned), welcome card, monthly budget gauge, cash-flow line chart, spending-by-category bars, recent transactions. The "balances by account" card is left out until accounts exist. | `GET /api/summary`, `/api/cashflow`, `/api/transactions?limit=5` |
| Transactions | Table filterable by All / Income / Outcome and by category | `GET /api/transactions` |
| Accounts | **Deferred** (no accounts yet). The sidebar item is hidden. | |
| Receipts | Processing queue (live), scanned history, "How it works" | `GET /api/receipts` |
| Transaction drawer | Detail with items read from the receipt, original screenshot, edit category/direction, delete | `GET/PATCH/DELETE /api/transactions/:id` |
| Add transaction | Manual entry (mainly income without a screenshot) | `POST /api/transactions` |
| Shell | Sidebar + header as in the prototype, but with no sign-in screen and no user/profile items | |

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
| `income` | Other Income | income | (to pick) |
| `transfer` | Transfer | internal | `IONIconKKeyDefault` |

`transfer` (direction `internal`) is left out of income and spending totals. `health`, `entertainment`, `other` and `income` are additions to the design's list. An outgoing transfer to another person is an expense, categorised by purpose (`other` if unknown).

## API

| Method | Path | Status | Notes |
|---|---|---|---|
| GET | `/api/health` | built | `{"status":"ok"}` |
| GET | `/api/summary` | placeholder | Hard-coded stat cards |
| POST | `/api/receipts` | planned | Multipart `image`, bearer `FIRE_INGEST_TOKEN`, returns `202 {id}` |
| GET | `/api/receipts` | planned | Queue and history |
| GET | `/api/receipts/:id/image` | planned | Original screenshot |
| GET | `/api/transactions` | planned | `?direction=in\|out&category=&currency=&from=&to=&limit=` |
| POST | `/api/transactions` | planned | Manual entry |
| GET/PATCH/DELETE | `/api/transactions/:id` | planned | PATCH for category/direction fixes |
| GET | `/api/cashflow` | planned | Monthly income/expense series in the base currency |

JSON fields are camelCase.

## Configuration

All configuration comes from environment variables. Put them in `backend/.env` locally (git-ignored); never commit them.

| Var | Purpose | Default |
|---|---|---|
| `HOST` | Bind address. Keep it local; `tailscale serve` proxies to it | `127.0.0.1` |
| `PORT` | HTTP port | `3000` |
| `RUST_LOG` | Log filter | `info` |
| `TURSO_DATABASE_URL` | `libsql://…turso.io` or `file:fire.db` | planned |
| `TURSO_AUTH_TOKEN` | Turso token (remote only) | planned |
| `FIRE_LLM_BASE_URL` | OpenAI-compatible base URL (the part before `/chat/completions`) | planned |
| `FIRE_LLM_API_KEY` | API key for that provider | planned |
| `FIRE_LLM_MODEL` | Vision-capable model id | `glm-5.3-flash` (planned) |
| `FIRE_LLM_JSON_MODE` | `json_schema` or `json_object` | `json_schema` (planned) |
| `FIRE_INGEST_TOKEN` | Shared secret the Shortcut sends | planned |
| `FIRE_BASE_CURRENCY` | Currency for totals and reports | `IDR` (planned) |
| `FIRE_DEFAULT_CURRENCY` | Assumed when the screenshot shows no currency symbol | `IDR` (planned) |
| `FIRE_OWNER_NAMES` | Comma-separated names on the owner's accounts, used for transfer direction | planned |
| `FIRE_STATIC_DIR` | Built frontend to serve (`frontend/dist`) | planned |

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

## Deployment

Fire runs on the owner's own server as **one process**. The Rust binary serves `/api/*` plus the built frontend (`FIRE_STATIC_DIR`). The plan is a systemd service or a small Docker image.

- **Network: Tailscale only.** The server and the iPhone are on the owner's tailnet, and Fire binds to the Tailscale interface or localhost, never to a public IP. There is no login, so the network is the access control.
- **HTTPS via `tailscale serve`.** Run `tailscale serve --bg 3000` on the server. This proxies `https://<server>.<tailnet>.ts.net` to Fire with an automatic certificate (enable MagicDNS + HTTPS certificates in the Tailscale admin console). No Caddy, domain or open ports are needed. Do **not** use `tailscale funnel`, which would make it public.
- `FIRE_INGEST_TOKEN` stays on `POST /api/receipts` as a second layer, so any device on the tailnet can't write by accident. Read routes need no token.
- Turso can stay remote (managed) or be replaced by a local `file:` database on the server. Either works with the same code.

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

1. **LLM model.** Start with `glm-5.3-flash`. Compare it with the Qwen vision models on 10–20 real receipts and transfers (merchant, total, direction, category, IDR amounts parsed correctly?) before settling on one.
2. **Duplicates.** Tapping twice on the same bill should not create two transactions. Plan: reject an identical image (`image_sha256`). If a different screenshot has the same merchant, total and time within a few minutes, flag it as a possible duplicate instead of saving it silently.
3. **Monthly budget.** The dashboard gauge needs a budget. Start with one env var or settings row in IDR, or drop the card?
