# Adryx Implementation Tasks

## Status Legend

- [ ] Not started
- [x] Done

---

## Dashboard Overview

- [ ] T01 — Spending velocity chart (daily burn rate across all campaigns)
- [ ] T02 — Budget health indicator (% used per campaign, color-coded)
- [ ] T03 — Recent activity feed (funded, paused, resumed, created events)
- [ ] T04 — Top performing campaigns table (CTR, impressions, clicks)

## Campaigns

- [ ] T05 — Edit campaign modal (name, description, dates, targetUrl, creativeUrl)
- [ ] T06 — Duplicate campaign
- [ ] T07 — Campaign filter & sort (by status, budget, date created)
- [ ] T08 — Bulk actions (pause all active, delete all drafts)
- [ ] T09 — End date countdown badge on active campaigns
- [ ] T10 — Campaign detail drawer/modal (full stats inline)

## Create Campaign

- [ ] T11 — Draft auto-save (persist form to localStorage)
- [ ] T12 — Creative preview (show ad mockup before submit)
- [ ] T13 — Target URL validator (check URL is reachable on blur)
- [ ] T14 — Budget recommendation hint based on format

## Analytics

- [ ] T15 — Campaign selector dropdown (pick any campaign, not just via URL param)
- [ ] T16 — Top performing campaigns table on analytics page
- [ ] T17 — Export analytics to CSV
- [ ] T18 — Campaign comparison (select two campaigns, side-by-side metrics)
- [ ] T19 — Time-of-day heatmap (best performing hours)

## Wallet

- [ ] T20 — Live SOL → USD price conversion (via CoinGecko API)
- [ ] T21 — Transaction filter (by campaign, date range)
- [ ] T22 — Auto-reload threshold setting (stored in profile)

## Notifications

- [ ] T23 — Mark notification as read / dismiss
- [ ] T24 — Persist dismissed notifications (localStorage)

## Settings Page (new page)

- [ ] T25 — Settings page scaffold at /dashboard/settings
- [ ] T26 — Edit profile (name, email) — backend: PATCH /auth/profile
- [ ] T27 — Change password — backend: PATCH /auth/password
- [ ] T28 — Notification preferences (budget alert threshold %)
- [ ] T29 — Connected wallet display + link/unlink wallet
- [ ] T30 — Timezone preference (stored in profile, used in analytics dates)

## Backend

- [ ] T31 — PATCH /auth/profile endpoint (update name, email, timezone)
- [ ] T32 — PATCH /auth/password endpoint (change password)
- [ ] T33 — GET /analytics/advertiser/activity — recent events feed
- [ ] T34 — GET /analytics/top-campaigns scoped to advertiserId (currently returns all active)
- [ ] T35 — Campaign duplicate endpoint POST /campaigns/:id/duplicate
