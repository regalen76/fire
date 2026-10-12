-- Fire schema v1. Money is integer minor units (×100 for every currency).
-- `amount_minor` is signed by direction: out < 0, in > 0, internal > 0 (unsigned).

CREATE TABLE categories (
    id    TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    icon  TEXT NOT NULL,
    kind  TEXT NOT NULL CHECK (kind IN ('expense', 'income', 'internal'))
);

INSERT INTO categories (id, label, icon, kind) VALUES
    ('food',          'Food & Dining',     'IONIconCCartDefault',      'expense'),
    ('groceries',     'Groceries',         'IONIconCCubeDefault',      'expense'),
    ('transport',     'Transport',         'IONIconRRocketSharp',      'expense'),
    ('bills',         'Bills & Utilities', 'Domain',                   'expense'),
    ('subs',          'Subscriptions',     'IONIconDDocumentsDefault', 'expense'),
    ('shopping',      'Shopping',          'IONIconCCardDefault',      'expense'),
    ('health',        'Health',            'IONIconCCheckmarkCCircle', 'expense'),
    ('entertainment', 'Entertainment',     'TagFaces',                 'expense'),
    ('other',         'Other',             'MoreHoriz',                'expense'),
    ('salary',        'Salary',            'IONIconWWalletDefault',    'income'),
    ('income',        'Other Income',      'IONIconSStatsChart',       'income'),
    ('transfer',      'Transfer',          'IONIconKKeyDefault',       'internal');

CREATE TABLE receipts (
    id           INTEGER PRIMARY KEY,
    status       TEXT NOT NULL CHECK (status IN ('processing', 'done', 'failed', 'rejected', 'duplicate')),
    image        BLOB NOT NULL,
    mime         TEXT NOT NULL,
    image_sha256 TEXT NOT NULL UNIQUE,
    llm_model    TEXT,
    llm_json     TEXT,
    error        TEXT,
    duplicate_of INTEGER,            -- transactions.id this receipt duplicates
    created_at   TEXT NOT NULL,      -- RFC 3339 UTC
    processed_at TEXT
);

CREATE TABLE transactions (
    id                INTEGER PRIMARY KEY,
    receipt_id        INTEGER,       -- receipts.id, NULL for manual entries
    category_id       TEXT NOT NULL REFERENCES categories (id),
    direction         TEXT NOT NULL CHECK (direction IN ('in', 'out', 'internal')),
    merchant          TEXT NOT NULL, -- merchant or transfer counterparty
    occurred_at       TEXT NOT NULL, -- owner's local time, 'YYYY-MM-DDTHH:MM:SS'
    amount_minor      INTEGER NOT NULL,
    currency          TEXT NOT NULL,
    amount_base_minor INTEGER NOT NULL,
    fx_rate           REAL NOT NULL, -- base units per 1 unit of `currency`
    payment_method    TEXT,
    source            TEXT NOT NULL CHECK (source IN ('receipt', 'manual')),
    note              TEXT,
    created_at        TEXT NOT NULL
);

CREATE INDEX transactions_occurred_at ON transactions (occurred_at);
CREATE INDEX transactions_receipt_id ON transactions (receipt_id);

CREATE TABLE transaction_items (
    id             INTEGER PRIMARY KEY,
    transaction_id INTEGER NOT NULL,
    name           TEXT NOT NULL,
    quantity       REAL,
    amount_minor   INTEGER
);

CREATE INDEX transaction_items_transaction_id ON transaction_items (transaction_id);

CREATE TABLE fx_rates (
    date         TEXT NOT NULL,
    currency     TEXT NOT NULL,
    rate_to_base REAL NOT NULL,
    PRIMARY KEY (date, currency)
);

CREATE TABLE settings (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
);
