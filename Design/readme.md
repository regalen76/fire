# Vision Finance Design System

A dark, glassy design system for a **personal finance web app**. Your phone sends screenshots of bills to your own finance service. The service reads each image and pulls out the merchant, line items and category. This web app calls the service's API to show your history, purchases, categories, income, outcome and which bank account holds your money.

## Sources
- **Vision UI Dashboard React – MUI Dashboard (Free Version) (Community).fig**: the main visual source. Frames used: Dashboard, Billing, Tables and Sign In screens (page `Vision-UI-Dashboard---Pages`), plus the Sign Up and Profile frames, which were only listed. Public reference: Vision UI Dashboard by Simmmple × Creative Tim.
- **Animated Sidebar for Web Dashboards (Community).fig**, page `Components`: used for the sidebar's *behaviour and inventory*. It defines Sidebar, Nav item (State Default/Hover/Active × Collapsed), Logo, Avatar, Button (Hover) and Badge, plus Heroicons-style outline glyphs. That file is light-themed (slate/indigo, Rubik/Poppins). As requested, its structure is rendered in Vision UI's dark palette. **Caveat:** that file unmounted partway through the import. I read only its metadata and component list, not its JSX values, so sidebar sizes come from Vision UI's own sidebar.

## Index
- `styles.css`: global entry (imports only) → `tokens/fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `base.css`
- `guidelines/`: foundation specimen cards (Colors, Type, Spacing, Brand)
- `components/core/`: Button, Card, IconTile, Input, Switch, ProgressBar, Badge
- `components/navigation/`: Sidebar, NavItem, Logo, SidebarToggle, Avatar, HelpCard, PageHeader
- `components/data/`: StatCard, TransactionItem, InvoiceItem, Balance, CreditCard, AvatarsGroup, MiniStat
- `components/charts/`: LineChart, BarChart, Gauge
- `components/icons/`: Icon + `icon-data.js` (34 glyphs)
- `ui_kits/finance-web/`: click-through finance app (Dashboard, Transactions, Accounts, Receipts, Sign In)
- `assets/images/`: backdrop, welcome photo, help-card photo, card texture, auth hero, avatars, balance sparkline; `assets/icons/search.svg`
- `SKILL.md`: agent-skill entry point

### Components
Breadcrumb, Balance, AvatarsGroup, Button, Card, IconTile, Input, Switch, ProgressBar, Badge, Sidebar, NavItem, Logo, SidebarToggle, Avatar, HelpCard, PageHeader, StatCard, TransactionItem, InvoiceItem, Balance, CreditCard, AvatarsGroup, MiniStat, LineChart, BarChart, Gauge, Icon.

**Source mapping**
- Animated Sidebar's Sidebar / Nav item / Logo / Avatar / Badge / Button(Hover) → `Sidebar`, `NavItem`, `Logo`, `Avatar`, `Badge` (count/dot), `SidebarToggle`.
- Vision UI's Balance → `Balance`; Line Chart 2 (Type=Increased) → `LineChart` (green series); Avatars Group 3 → `AvatarsGroup`; Breadcrumb/Item/Previous → inside `PageHeader`; Person Photo 4/14/16/23 → `PersonPhoto4`, `PersonPhoto14`, `PersonPhoto16`, `PersonPhoto23` (components/photos/); icon symbols → `Icon`.

## Intentional additions
Confirmed intentional additions. None has a component set in either .fig; each is promoted from a repeated layer pattern so the finance app can compose it:
- `BarChart` — Active Users bar chart on Dashboard.
- `Gauge` — Satisfaction Rate / Referral gauges on Dashboard.
- `LineChart` — Sales overview chart; source Line Chart 2 is a static vector.
- `Badge` — status chips on Tables + sidebar count badge.
- `Button` — `_Button/Base` layers across screens.
- `Card` — glass panel wrapping every Vision UI widget.
- `IconTile` — teal icon squares on stat cards.
- `Input` — `_Input/*` layers on Sign In/Up.
- `ProgressBar` — completion bars in Tables projects.
- `Switch` — `_Switch/Base` on Sign In / Profile.
- `CreditCard` — Billing card visual.
- `TransactionItem` — Your Transactions rows on Billing.
- `InvoiceItem` — Invoices rows on Billing.
- `MiniStat` — Active Users stat items.
- `StatCard` — Total Sales cards on Dashboard.
- `HelpCard` — Need Help card in sidebar.
- `PageHeader` — breadcrumb + title bar on every screen.
- `NavItem` — sidebar nav row (Animated Sidebar layer, not a component set).
- `SidebarToggle` — collapse button from Animated Sidebar.
- `Avatar` — avatar from Animated Sidebar user block.
- `Logo` — wordmark in type; no logo in sources.
- `Sidebar` — Animated Sidebar frame promoted to component.
- `Icon` — wrapper for copied SVG icon set.

## Import coverage (full Vision UI file)
- Icons: 34 of the file's 37 icon symbols are in `Icon`. `electric_car`, `facebook` and `FontAwesome/Regular` have no extractable vector geometry, so they were left out rather than shipped as blank boxes.
- Person Photos: the original photos are 6–11 MB each, too large to ship, so the components use the downscaled copies in assets/images/avatar-1…4.png. Which file belongs to which photo number is a best guess.

## Content fundamentals
- **Voice:** short, friendly and direct. The product speaks to "you" ("Glad to see you again! Ask me anything.", "Nice to see you!", "Please check our docs").
- **Casing:**
  - Card titles, nav items and labels use Title Case: "Sales overview", "Your Transactions", "Billing Information".
  - Buttons, overlines and table headers use UPPERCASE: "VIEW ALL", "ADD A NEW CARD", "NEWEST", "COMPANIES", "DELETE / EDIT".
- **Numbers do the talking:**
  - Amounts are bold and white: "$53,000", "$25,215".
  - Deltas sit right after, coloured green or red: "+55%", "-14%".
  - Subtitles use bracketed deltas: "(+5) more in 2021", "(+23) than last week".
- **Dates:** written out in long form: "27 March 2020, at 12:30 PM", "23 - 30 March 2020", "Today, 16:36".
- **Signed money:**
  - Transactions show signs: "+$2500" in green, "-$2500" in muted gray.
  - "Pending" appears instead of an amount.
- **Emoji:** none in the UI. (The template footer has ❤️; drop it.)

## Visual foundations
- **Colour:**
  - Deep navy throughout: app `rgb(6,11,38)`, panels `rgba(6,11,40,0.94)` fading to `rgba(10,14,35,0.49)`.
  - One accent: `rgb(0,117,255)` blue, used on icon tiles, primary buttons, active nav and chart lines. Supporting colours are cyan `rgb(44,217,255)` for second chart series and violet `rgb(67,24,255)/(88,44,255)` for card art and the more-icon.
  - Green `rgb(1,181,116)` means income/up; red `rgb(227,26,26)` means expense/down; `rgb(245,60,43)` is destructive.
  - Text is pure white, with secondary slate `rgb(160,174,192)`.
- **Type:**
  - Plus Jakarta Display at 400/500/700 for nearly everything. Helvetica appears in some subtitles and the footer. DM Sans Bold is used only for big display/hero numbers.
  - Scale: 10 (overline/button), 12, 14 (body), 18 (card title, bold), 24 (card number), 34 (balance), 36 (welcome).
  - The wordmark is 14px with 0.18em tracking.
- **Backgrounds:**
  - A full-bleed navy gradient (`167°`, `rgb(15,18,59) → rgb(9,13,46) → rgb(2,5,21)`) over a blue abstract photo.
  - Feature cards use photography: a violet jellyfish, a blue-teal abstract, a violet grain card texture.
  - Imagery is cool-toned, electric blue/violet, glowing on black. No hand-drawn illustration and no patterns.
- **Glass:**
  - Every surface is a translucent gradient with `backdrop-filter: blur(120px)`. Buttons on photos use a 10px blur.
  - No borders on cards and no drop shadows; depth comes from the gradient only. Icon tiles carry a near-invisible `0 3.5px 5.5px rgba(0,0,0,0.02)`.
- **Nesting:** inner tiles (Invited/Bonus, gauge readout, Billing rows) use a second, darker gradient (`--gradient-inset`, `--gradient-row`) with the same 20px radius.
- **Radii:**
  - Cards: 20
  - Nav rows and inputs: 15
  - Buttons and icon tiles: 12
  - Status chips: 8
  - Mini tiles: 6
  - Switches: pill
  - Avatars: 12px squircle in tables, circles in groups
- **Lines:** dividers are 0.5px `rgb(86,87,122)`. The sidebar divider is a horizontal gradient hairline. Progress tracks are 3px `rgb(45,46,95)` with a blue fill.
- **Charts:**
  - Smooth curves with a vertical gradient fill from colour to transparent, and dashed navy gridlines.
  - Axis labels are 10px bold gray.
  - Bars are 6px white rounded sticks.
- **Layout:**
  - The sidebar floats, inset 10px from the viewport. It is 264px wide, collapses to 88px, and stays sticky.
  - Content starts 24px to its right, in a 1600px grid of cards with 24px gutters. The page header holds a breadcrumb plus search, and the footer is a single line.
- **Motion:**
  - Comes from the Animated Sidebar file: width animates over 350ms with `cubic-bezier(0.22,1,0.36,1)`; labels fade and collapse over 250ms; the toggle arrow rotates.
  - Hover: nav rows gain a translucent navy fill and their icon nudges 2px; buttons brighten (brightness 1.12); text actions go white.
  - No bounce and no press shrink. Drawers slide in on the same ease.
- **Transparency:** used everywhere for surfaces. Ghost fills are 8% white (more buttons, category circles).

## Iconography
- The Vision UI file uses **IONIcons** (filled: home, stats-chart, card, wallet, cart, rocket, document, person, settings, notifications, help-circle, calendar-outline, globe-outline, logos…) and a few **Material** glyphs (delete, edit, domain, more_horiz/vert, priority_high, tag_faces).
- All 34 usable glyphs were extracted into `components/icons/icon-data.js`. Render them with `<Icon name="…">`; they paint with `currentColor`.
- Not available:
  - `facebook` and `electric_car` had no decodable geometry and were dropped.
  - The FontAwesome symbol and the breadcrumb chevron had no vector data.
  - The search magnifier is a separate SVG (`assets/icons/search.svg`).
- Icons sit inside coloured tiles: white glyph on blue for active, blue glyph on navy for inactive.
- Sizes:
  - 15px in 30px nav tiles
  - 22.5px in 45px stat tiles
  - 12–15px inline
- The Animated Sidebar file uses Heroicons outline glyphs. Those weren't extracted (the file unmounted), so nav uses the IONIcon equivalents. If you want them, Heroicons can be loaded from a CDN.
- No emoji and no unicode-as-icon (except "×" for closing the drawer).

## Fonts
- **Plus Jakarta Display** (primary): self-hosted from `fonts/PlusJakartaSans-Regular.ttf` (Plus Jakarta Sans, the nearest match). Only Regular 400 is present; 500/700 are synthesized by the browser. Upload Medium/Bold files for true weights.
- DM Sans (display numbers) loads from Google Fonts. Helvetica is a system font.

## Brand / logo
No logo file exists in either source. The wordmark is set in type ("VISION UI FREE" in the source, "VISION FINANCE" in the kit).
