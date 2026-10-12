# Finance Web App — UI kit

Click-through recreation of the finance dashboard, built from Vision UI's Dashboard, Billing, Tables and Sign In frames plus the Animated Sidebar's collapsible nav.

Data flow it mocks (`data.js`): phone → screenshot of a bill → finance service parses merchant / items / category → this web app reads history, income, outcome and per-account balances from the service API.

Screens
- `DashboardScreen.jsx` — KPI stat cards, welcome card, budget gauge, cash-flow area chart, spending-by-category bars, recent transactions, balances by account.
- `TransactionsScreen.jsx` — filterable table (All / Income / Outcome, category chips), Tables-screen styling.
- `AccountsScreen.jsx` — card visual + balance tile (Billing), linked accounts, per-account activity.
- `ReceiptsScreen.jsx` — processing queue (live progress) and scanned-receipt history (Invoices pattern).
- `TransactionDrawer.jsx` — slide-in detail with items read from the receipt.
- `SignInScreen.jsx` — Vision UI sign-in layout.
- `Shell.jsx` — animated Sidebar + PageHeader + footer.

Sidebar collapse and current page persist in localStorage.
