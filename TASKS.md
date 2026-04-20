# Adryx Implementation Tasks

## Status Legend

- [ ] Not started
- [x] Done

---

## Advertiser Dashboard (All Done)

- [x] T01–T35 — All advertiser tasks complete

---

## Publisher Dashboard

### Backend

- [x] P01 — Fix sites controller: remove hardcoded `temp-publisher-id`, wire real JWT auth
- [x] P02 — `verifySite` now fetches the URL and checks for the meta tag
- [x] P03 — `GET /analytics/publisher/activity` — recent placement events feed
- [x] P04 — `GET /analytics/publisher/top-placements` — top placements by earnings
- [x] P05 — `GET /analytics/publisher/heatmap` — hourly click heatmap
- [x] P06 — `GET /analytics/publisher/earnings-chart` — daily earnings time-series

### API Client

- [x] P07 — Publisher API methods: sites CRUD, placements CRUD, publisher dashboard, earnings chart, top placements, activity, heatmap, claim earnings

### Hooks

- [x] P08 — `useSites()`
- [x] P09 — `usePlacements(siteId?)`
- [x] P10 — `usePublisherDashboard()`
- [x] P11 — `usePublisherEarnings()`
- [x] P12 — `usePublisherActivity()`
- [x] P13 — `usePublisherTopPlacements()`

### Publisher Overview Page

- [x] P14 — Real metrics from `usePublisherDashboard()`
- [x] P15 — Real top placements from `usePublisherTopPlacements()`
- [x] P16 — Real activity feed from `usePublisherActivity()`
- [x] P17 — Earnings chart from `usePublisherEarnings()`

### Sites Page

- [x] P18 — "Add Site" modal wired to `POST /sites`
- [x] P19 — Real sites list from `useSites()`
- [x] P20 — Verify button wired to `POST /sites/:id/verify`
- [x] P21 — Verification code snippet with copy-to-clipboard
- [x] P22 — Delete site action
- [x] P23 — Per-site placement count from real data

### Placements Page

- [x] P24 — "New Placement" modal wired to `POST /placements`
- [x] P25 — Real placements from `usePlacements()`
- [x] P26 — Real stats per placement (impressions, clicks, CTR, earnings)
- [x] P27 — Pause/resume placement actions
- [x] P28 — Delete placement action
- [x] P29 — Embed code modal with copy-to-clipboard

### Analytics Page

- [x] P30 — Real earnings chart from `usePublisherEarnings()`
- [x] P31 — Real top performers from `usePublisherTopPlacements()`
- [x] P32 — Date range selector (7D / 30D / 90D)
- [x] P33 — Hourly heatmap from `usePublisherHeatmap()`
- [x] P34 — Export analytics to CSV

### Earnings Page

- [x] P35 — Real summary cards from `usePublisherDashboard()`
- [x] P36 — Real earnings chart
- [x] P37 — Avg CPC from real data
- [x] P38 — "Claim Earnings" button wired to `POST /solana/claim-earnings`
- [x] P39 — Pending vs claimed breakdown

### Settings Page

- [x] P40 — Profile form wired to `PATCH /auth/profile`
- [x] P41 — Password change wired to `PATCH /auth/password`
- [x] P42 — Wallet display with `WalletButton`
- [x] P43 — Notification preferences in localStorage

### Publisher Nav & Layout

- [x] P44 — `PublisherSidebar` shows real user name/role from `useAuth()`
- [x] P45 — Logout button in publisher sidebar
