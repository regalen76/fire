# Fire: next session brief

Paste everything below the line into a new Claude Code session on `regalen76/fire`, branch `claude/nice-bardeen-unvuah`. Attach a few real screenshots (IDR receipts, a USD/PayPal one if available, and an incoming bank transfer) to the same message.

---

Continue the Fire project on branch `claude/nice-bardeen-unvuah` (commit and push there; don't open a PR unless I ask).

**Read first:** `CLAUDE.md` (rules and architecture decisions), `README.md` (pipeline, schema, full API table, config) and `Design/readme.md` (visual and copy rules). Don't re-discuss settled decisions; they're recorded there.

**Current state:**
- The backend is complete: receipt ingest, Turso/libSQL storage and every API route in the README. 26 tests pass.
- It has only ever run against a fake model.
- The frontend is still a single overview card (`frontend/src/App.tsx`, `api.ts`, `format.ts`).

## Part 1: test the real model on my screenshots

1. Check that the cloud environment variables are present: `FIRE_LLM_BASE_URL`, `FIRE_LLM_API_KEY`, `FIRE_LLM_MODEL` (`glm-5.3-flash`), `FIRE_INGEST_TOKEN` and `FIRE_OWNER_NAMES`. Print only set/not set, never the values. If any are missing, tell me and stop Part 1.
2. Run the backend with a throwaway local DB (`TURSO_DATABASE_URL=file:<scratchpad>/test.db`). Upload each attached screenshot with `curl -H "Authorization: Bearer $FIRE_INGEST_TOKEN" -F image=@… localhost:3000/api/receipts`.
3. Show me a table with one row per screenshot: status, merchant, direction, category, total (original currency and IDR), date, paymentMethod, and anything wrong.
4. Fix what's wrong:
   - **Provider rejects `json_schema`:** set `FIRE_LLM_JSON_MODE=json_object`.
   - **Systematic misreads:** tune the prompt in `backend/src/llm.rs` (`system_prompt`). Common ones are Indonesian number formats, transfer direction, and year/date.
   - **Bugs in normalisation:** fix them in `backend/src/ingest.rs` or `backend/src/money.rs`, and add a unit test for each fix.
   - Re-run until the results are right.
5. If the attached image arrives as HEIC, say so; the backend rejects HEIC on purpose.

## Part 2: build the frontend screens

Port the prototype in `Design/ui_kits/finance-web/` to typed React in `frontend/src/`, using real API data. The rules in `CLAUDE.md` → Frontend rules apply:
- Use Design components via `@design/...`.
- Use the CSS tokens only, with no hard-coded colours.
- Follow the motion guideline.
- Copy: Title Case card titles, UPPERCASE buttons, signed amounts, long-form dates, no emoji.

Read each component's `.d.ts` and `.prompt.md` before using it.

**Screens:**
1. **Shell** (`Shell.jsx`): Sidebar plus PageHeader plus footer.
   - Nav: Dashboard, Transactions, Receipts. Show a badge with the count of `processing` receipts.
   - No Accounts, Profile or Sign Out items, and no user/avatar block.
   - Keep the "Scan a bill / HOW IT WORKS" help card, linking to the Receipts screen.
   - The sidebar's collapsed state and the current page persist in `localStorage`.
   - Simple state or hash routing is fine; no router library is needed.
2. **Dashboard** (`DashboardScreen.jsx`), from `GET /api/summary` and `/api/cashflow`:
   - Stat cards: Net, Income, Spending, Receipts Scanned. Show deltas against `previous`. Spending going up shows red.
   - Welcome card.
   - **Monthly Budget gauge card:** `budgetMinor` is `null` until a budget is set. Then show "No budget set" with a SET BUDGET button and an inline input, saved via `PUT /api/settings/budget`. When set, show spending against the budget with an edit/clear option.
   - Cash Flow line chart (income/spending per month).
   - Spending by Category bars plus the top-3 MiniStats.
   - Recent Transactions (`/api/transactions?limit=5`).
   - Drop the prototype's "balances by account" card.
3. **Transactions** (`TransactionsScreen.jsx`):
   - A table filtered by All / Income / Outcome (`direction=in|out`) and category chips. Internal transfers show only under All.
   - Search with `q`. Paginate with `limit`/`offset`.
   - Columns: Merchant (category icon tile), Category, Payment (`paymentMethod`), Source badge (Receipt/Manual), Date, Amount.
4. **Receipts** (`ReceiptsScreen.jsx`):
   - **Processing** card: real `processing` receipts, polled every ~2s while any exist. Show an indeterminate progress bar, not a fake percentage.
   - **Scanned Receipts** history with a status badge for done, failed, rejected and duplicate, plus the reason.
   - Thumbnails come from `/api/receipts/:id/image`.
   - Actions: RETRY for failed receipts, DELETE.
   - **How It Works** card, adapted to the Back Tap flow.
5. **Transaction drawer** (`TransactionDrawer.jsx`), from `GET /api/transactions/:id`:
   - Amount, with the original currency next to IDR when they differ (e.g. `-Rp 204.800 · -$12.80`).
   - Items read from the receipt, the original screenshot, and payment method and note.
   - Edit category or direction via `PATCH`. DELETE asks for confirmation first.
6. **Add Transaction:** a form for manual entry (mainly income), `POST /api/transactions`. Fields: direction, merchant, amount, currency (default IDR), category filtered by direction, date/time, note.

**Data and formatting:**
- Money arrives as integer minor units (×100). Extend `format.ts`:
  - IDR is `Rp 25.000` with no decimals. USD is `$12.80`.
  - Signed amounts: green `+` for income, muted `-` for expenses. Internal transfers are unsigned and muted.
  - Long dates: "9 October 2026, at 4:36 PM".
- Categories (label and icon) come from `GET /api/categories`. Fetch them once and share them.
- Put typed fetch helpers for every endpoint in `api.ts`.
- Every screen needs loading, empty and error states. The app starts with no data.

**Verify:**
- Seed realistic data through `POST /api/transactions`, plus a few uploaded receipts if Part 1 worked. Run the backend and `npm run dev`.
- Take screenshots of every screen with Playwright, using the pre-installed Chromium. Check them against the prototype (open `Design/ui_kits/finance-web/index.html` for comparison). Check desktop width and a phone width (390px).
- Run `npm run typecheck` and `npm run build`, plus `cargo test` and clippy if the backend changed.
- Update `README.md`: the status line, and the screen table marked built. Update `CLAUDE.md` if new conventions appear.
- Commit and push.

Ask me before changing any decision recorded in `CLAUDE.md`. If something in the design system is missing or broken, work around it in `frontend/` and tell me; don't edit `Design/`.
