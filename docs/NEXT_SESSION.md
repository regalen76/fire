# Fire: next session brief

Paste everything below the line into a new Claude Code session on `regalen76/fire`. Attach 10–20 **real** screenshots (IDR receipts, e-wallet/QRIS payments, a USD/PayPal one, incoming and outgoing bank transfers, one own-account top-up).

---

Continue the Fire project (commit and push to the session branch; don't open a PR unless I ask).

**Read first:** `CLAUDE.md`, `README.md`, `Design/readme.md`.

**Current state:** backend and web app are built (Dashboard, Transactions, Receipts, drawer, Add Transaction). `glm-5.3-flash` has only been checked on four synthetic screenshots, which it read correctly.

**Task: test the real model on my attached screenshots** (README open question 1).
1. Check `FIRE_LLM_BASE_URL`, `FIRE_LLM_API_KEY`, `FIRE_LLM_MODEL`, `FIRE_INGEST_TOKEN`, `FIRE_OWNER_NAMES` are set (print set/not set only).
2. Run the backend on a throwaway DB (`TURSO_DATABASE_URL=file:<scratchpad>/test.db`) and upload each screenshot with curl. If one is HEIC, say so (rejected on purpose).
3. Table per screenshot: status, merchant, direction, category, total (original + IDR), date, paymentMethod, what's wrong.
4. Fix systematic misreads in `system_prompt` (`backend/src/llm.rs`), normalisation bugs in `ingest.rs`/`money.rs` (with a unit test each). Re-run until right.
5. Optionally compare a Qwen vision model on the same set and recommend one.
6. Look at the results in the web app (`npm run dev`), run `cargo test`, clippy, `npm run typecheck`, `npm run build`, update the README, commit and push.
