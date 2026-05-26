# Advertiser Dashboard — Redesign Tasks

All pages share the Adryx design system: CSS custom-property tokens, `globals.css` component classes, and the UI primitive library at `src/components/ui/index.tsx`. No Tailwind utility classes, no inline hex colors — use `var(--c-*)` tokens only.

---

## A1 · Overview (`advertiser/page.tsx`)

**Current state:** 310 lines. Stat cards + area chart + geo map + campaign table + funnel + activity feed. Functional but dense and unbalanced.

**Changes:**

1. **Hero row** — Replace plain h1 with a greeting strip: left side has `"Good morning, Forecast Labs"` + `"5 campaigns live · $1,238 settles in next batch"` sub-line; right side has the `Seg` range switcher. Remove the separate header block.

2. **Stat cards (grid-4)** — Each card gets a `Sparkline` in the top-right corner, the delta badge moves below the value (use `.stat-meta` + `.delta-up`/`.delta-down`). Add a 5th card: **Active campaigns** count with a badge showing how many are paused.

3. **Revenue chart** — Full-width card, min height 220px. Add a `compare` line (previous period, dashed) using the `AreaChart` `compare` prop. Add a legend row below the chart: two dots with labels "Current period" / "Previous period".

4. **Below-chart row (grid-2)** — Left: **Campaign performance** — a vertical `Funnel` component showing Impressions → Clicks → Conversions → Purchases with percentages. Right: **Top geos** — `GeoMap` with a ranked list underneath (flag + country + revenue, 5 rows).

5. **Campaign table** — Move `CampaignTable` here unchanged but add an **"Actions"** column on the right with three icon buttons per row: Play/Pause toggle (based on status), Edit (pencil), More (dots). The play/pause button should use `Icons.play`/`Icons.pause`.

6. **Activity feed** — Replace plain list with a timeline: left has a vertical `2px` line with dots at each entry. Each entry: icon in a 28×28 circle, message text, `<time>` in muted on the right.

---

## A2 · Campaigns (`advertiser/campaigns/page.tsx`)

**Current state:** 92 lines — minimal. Just tabs + search + table.

**Changes:**

1. **Summary strip** — Above the tabs, add a row of 4 mini-stat pills (not full cards): `Active · 3`, `Paused · 1`, `In review · 1`, `Ended · 1`. Each is a small badge-like chip with a dot.

2. **Tab counts** — Each `Tabs` tab shows the count in parentheses: `All (6)`, `Active (3)`, etc. Use the `count` prop on each tab object.

3. **Toolbar row** — Between tabs and table: left side has the search input; right side has a **Sort** button (`Icons.filter` + "Sort") and the existing Export + New campaign buttons.

4. **CampaignTable enhancements** — The table (imported from `../page`) needs these additional columns:
   - **Budget progress** column: a narrow progress bar showing `spent/budget` percentage with the dollar amount below it (`$4,820 / $8,000`).
   - **Pacing** indicator: a small colored dot — green if on-pace (spent% ≈ time% elapsed), amber if under, red if over.
   - **Actions** column: same Play/Pause + Edit + More icon buttons as A1.

5. **Bulk selection** — Add a checkbox column. When rows are selected, show a floating action bar at the bottom of the viewport: "3 selected · Pause · Archive · Delete". Use a `.card` with `position: fixed`, `bottom: 24px`, centered.

6. **Empty state** — When `filtered.length === 0` and there are no campaigns at all (not just filtered), show a full-width `.empty` card with `Icons.campaign` (large, 40px), "No campaigns yet" heading, sub-line "Create your first campaign to start serving ads", and a primary "New campaign" button.

---

## A3 · New Campaign Wizard (`advertiser/campaigns/new/page.tsx`)

**Current state:** 647 lines — most complete. 5 steps with preview panel.

**Changes:**

1. **Step rail** — Replace the inline step dots with a horizontal step rail at the top of the form panel. Each step: number circle + label. Completed steps show `Icons.check` in a green circle. Active step has the accent border. Clicking a completed step navigates back to it.

2. **Step 1 — Basics** — Add a **Category** select (Crypto/DeFi, NFT, Developer tools, News & Media, Other) below the name field. Add a `Field` with hint text explaining what the name is used for.

3. **Step 2 — Targeting** — Split into two sub-sections with dividers:
   - **Audience segments** — a 2-col grid of audience toggle cards (name + reach size). Selecting one highlights the card with an accent border.
   - **Geo targeting** — show a simplified `GeoMap` with region checkboxes below it (Global, North America, Europe, Asia-Pacific, LatAm).

4. **Step 3 — Creative** — Replace the placeholder with a real drag-and-drop zone card (`.empty` style with dashed border, `Icons.download` icon, "Drop your creative here or browse"). Below it, a format selector: three format cards (Leaderboard, MPU, Native) that are clickable and highlight on selection.

5. **Step 4 — Budget** — Add a daily spend cap field below the total budget. Add a start/end date picker (two `Field`s side by side with `type="date"` inputs). Add a read-only projected reach estimate: `"~1.2M–1.8M impressions over 30 days"` based on budget/avg-eCPM calculation.

6. **Step 5 — Review** — Use a `<dl className="dl">` definition list for all settings. Add an on-chain escrow notice box (accent-soft background, `Icons.shield` + "Funds will be held in escrow and released to publishers per verified impression").

7. **Preview panel** — Live-update the estimated metrics (Impressions, Clicks, CTR, Conversions) as budget changes. Show a mini `Sparkline` of projected daily spend across the campaign duration.

---

## A4 · Analytics (`advertiser/analytics/page.tsx`)

**Current state:** 156 lines — sparse. Only spend trend + format bars + daily impressions bar + one table.

**Changes:**

1. **Campaign filter** — Add a `Select` dropdown at the top right (next to the range `Seg`): "All campaigns" + each campaign name. When a specific campaign is selected, all charts filter to that campaign. Label: `"Campaign"`.

2. **Metric tabs** — Replace the always-visible grid of charts with tabbed views. Use a `Tabs` component with tabs: `Impressions`, `Clicks`, `Spend`, `CTR`, `Conversions`. Each tab shows:
   - A large `AreaChart` (height 220) for the selected metric over time.
   - A compare line (previous period) using `AreaChart`'s `compare` prop.
   - Three stat pills below the chart: total, avg/day, peak day.

3. **Breakdown section** — Below the tabs, two cards side by side (grid-2):
   - Left: **By format** — the existing format progress bars, but each bar also shows the raw number (e.g. `3.2M imps`) next to the percentage.
   - Right: **By geo** — `GeoMap` + top 5 country rows with a % share bar.

4. **Conversion funnel** — Full-width `Funnel` component showing the 4 stages: Impressions → Clicks → Conversions → Purchases. Show percentage drop-off between stages in muted text on the right.

5. **Campaign breakdown table** — Move the existing table here (already exists at bottom), but add: a `Sparkline` column (7-day trend per campaign), a `% of total spend` column, and a row-click that sets the campaign filter above.

6. **Date comparison toggle** — A small button next to the range `Seg`: "Compare to previous period" with a `Icons.trend` icon. When active, adds the dashed compare line to all charts.

---

## A5 · Audiences (`advertiser/audiences/page.tsx`)

**Current state:** 106 lines — basic 3-col card grid.

**Changes:**

1. **Sidebar layout** — Change from full-width grid to a two-column layout: left column (280px fixed) is a filter panel; right column is the card grid.

2. **Filter panel** — Contains:
   - Search input (already exists, move here).
   - **Type filter** — a vertical list of checkboxes: Behavioral, Onchain, Social, Contextual, Custom. Checked types are shown; unchecked are hidden.
   - **Size range** — two number inputs ("Min reach" / "Max reach") with a "Reset" link.
   - **Tags** — a wrap of small tag pills (Web3, DeFi, NFT, Dev, Social, etc.) that toggle on/off.

3. **Audience card redesign** — Each card:
   - Header: name (bold) + `Badge` (type) on the same line.
   - Reach: large number in `.stat-value` style.
   - **Reach bar** — a thin progress bar showing the audience's reach relative to the largest segment.
   - Description text (existing).
   - Tags (existing).
   - Footer: "Add to campaign" outline button + a "Save" icon-only ghost button (`Icons.bookmark`).

4. **Selected state** — When "Add to campaign" is clicked, the card shows a green checkmark overlay and the button changes to "Added ✓". A sticky bottom bar counts selected: "2 audiences selected · Attach to campaign".

5. **Create audience card** — Last card in the grid: dashed border `.empty` style, `Icons.plus` (24px), "Build custom audience" text, "Coming soon" `Badge`.

---

## A6 · Creatives (`advertiser/creatives/page.tsx`)

**Current state:** 132 lines — 4-col grid with placeholder preview boxes.

**Changes:**

1. **Filter bar** — Above the grid: tabs for format (`All`, `Leaderboard`, `MPU`, `Skyscraper`, `Native`). Active tab highlights. Each tab shows the count. On the right: the existing search input.

2. **Creative card redesign** — Each card:
   - **Preview area** — Keep the dashed preview box but color it based on status: active cards get a faint accent-soft background; paused/ended get `--c-bg-3`. Show the format label and dimensions in monospace. Add a subtle hover overlay with an `Icons.eye` "Preview" button centered.
   - **Performance row** — Under the name: `CTR: 1.82%` + `2 campaigns` as two chips in a row.
   - **Actions** — Three icon buttons: `Icons.copy` (duplicate), `Icons.external` (preview), `Icons.more` (menu). Show on card hover.
   - **Status dot** — Small colored dot in the top-right corner of the card (green = active, amber = paused, grey = ended/review).

3. **Upload card** — The existing dashed upload card stays at the end but gets improved: `Icons.download` (24px), "Upload creative" heading, sub-line "PNG · JPG · GIF · WebP · max 2 MB", a ghost "Browse files" button.

4. **Bulk bar** — Same pattern as A2: selecting creatives with checkboxes shows a fixed bottom bar: "3 selected · Assign to campaign · Archive · Delete".

---

## A7 · Billing (`advertiser/billing/page.tsx`)

**Current state:** 212 lines — gradient treasury card + payment methods + transactions table + deposit modal.

**Changes:**

1. **Treasury card improvements** — Add a spend velocity indicator: `"Burning ~$340/day"` in small muted text below the balance. Add a visual progress bar: "Monthly budget used: 68% ($24,140 / $35,000)". The deposit and auto-fund buttons already exist — keep them.

2. **Budget alerts card** — New card below the treasury card: "Budget alerts" with two toggle rows:
   - "Notify when balance drops below $1,000" — toggle switch (use a checkbox styled as toggle via CSS).
   - "Auto-fund when balance < $500 — add $2,000 USDC" — toggle + configure link.

3. **Invoice row** — Add a section before transactions: "Invoices" with a table showing month, amount, PDF download (`Icons.download`). 3 rows of mock data (Mar 2026, Apr 2026, May 2026).

4. **Transaction table** — Add a **Type** column with a colored icon: `Icons.plus` (green circle) for deposits, `Icons.minus` (neutral) for spend, `Icons.refresh` (blue) for refunds. Add a filter: a small `Seg` above the table to filter by All / Deposits / Spend / Refunds.

5. **Deposit modal** — Add a second step after amount: "Confirm" step showing amount, source wallet, estimated network fee (~$0.02), and "You're depositing to escrow — funds will be available within 15s of on-chain confirmation." Then a success state with green checkmark (same pattern as publisher payouts).

---

## A8 · Settings (`advertiser/settings/page.tsx`)

**Current state:** 298 lines — side nav with 7 sections rendered conditionally.

**Changes:**

1. **Layout fix** — Change the side nav + content layout to a true two-column grid: `240px` left nav, `1fr` right content area. Add a sticky `position: sticky; top: 24px` to the nav so it stays visible when scrolling long sections.

2. **General section** — Add a **Company logo** upload field (dashed square, `Icons.plus`, "Upload logo"). Add a **Timezone** select. Add a **Language** select.

3. **Team section** — The existing team table needs:
   - Inline role `Select` per row (Owner / Admin / Member / Viewer) that's disabled for the current user.
   - A "Remove" ghost button that shows a confirmation inline (replace button with "Are you sure? Cancel / Remove").
   - Pending invites section below the team table with a resend link and revoke button.

4. **API keys section** — Redesign as a proper key management UI:
   - List existing keys in a table: Name, Created, Last used, Permissions, Actions (Revoke).
   - "Create new key" button opens a modal: name field + permissions checkboxes (Read, Write, Campaigns, Billing).
   - Key is shown once in a copy box after creation, with a warning "Store this somewhere safe — you won't see it again."

5. **Brand safety section** — New content (was placeholder): two groups of toggles:
   - **Blocked categories** — list of 8 categories (Adult, Gambling, Alcohol, etc.) with on/off toggles.
   - **Keyword blocklist** — a `Textarea` where advertisers can paste keywords they don't want their ads near.

6. **Notifications section** — Replace placeholder with a proper list of notification events (Campaign approved, Low balance, Payout settled, etc.) with two columns of toggles: Email / In-app.

7. **Danger zone** — Red-tinted section: "Delete account" button that opens a confirmation modal requiring the user to type the account name.

---

## Implementation order

| Priority | Page | Est. complexity |
|---|---|---|
| 1 | A2 — Campaigns | Medium |
| 2 | A4 — Analytics | Medium-high |
| 3 | A1 — Overview | Medium |
| 4 | A3 — New Campaign wizard | High |
| 5 | A6 — Creatives | Medium |
| 6 | A5 — Audiences | Medium |
| 7 | A7 — Billing | Low-medium |
| 8 | A8 — Settings | Medium |

All implementations: mock data only, no backend calls. Use existing `CAMPAIGNS`, `SITES`, `ACCT_AD` from `src/lib/mock-data.ts`. Add any new mock data directly in the page file.
