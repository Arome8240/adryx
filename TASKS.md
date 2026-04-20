# Adryx Implementation Tasks

## Status Legend

- [ ] Not started
- [x] Done

---

## Dashboard Overview

- [x] T01 — Spending velocity chart (daily burn rate across all campaigns)
- [x] T02 — Budget health indicator (% used per campaign, color-coded)
- [x] T03 — Recent activity feed (funded, paused, resumed, created events)
- [x] T04 — Top performing campaigns table (CTR, impressions, clicks)

## Campaigns

- [x] T05 — Edit campaign modal (name, description, dates, targetUrl, creativeUrl)
- [x] T06 — Duplicate campaign
- [x] T07 — Campaign filter & sort (by status, budget, date created)
- [x] T08 — Bulk actions (pause all active, delete all drafts)
- [x] T09 — End date countdown badge on active campaigns
- [x] T10 — Campaign detail drawer/modal (full stats inline)

## Create Campaign

- [x] T11 — Draft auto-save (persist form to localStorage)
- [x] T12 — Creative preview (show ad mockup before submit)
- [x] T13 — Target URL validator (check URL is reachable on blur)
- [x] T14 — Budget recommendation hint based on format

## Analytics

- [x] T15 — Campaign selector dropdown (pick any campaign, not just via URL param)
- [x] T16 — Top performing campaigns table on analytics page
- [x] T17 — Export analytics to CSV
- [x] T18 — Campaign comparison (select two campaigns, side-by-side metrics)
- [x] T19 — Time-of-day heatmap (best performing hours)

## Wallet

- [x] T20 — Live SOL → USD price conversion (via CoinGecko API)
- [x] T21 — Transaction filter (by campaign, date range)
- [x] T22 — Auto-reload threshold setting (stored in localStorage)

## Notifications

- [x] T23 — Mark notification as read / dismiss
- [x] T24 — Persist dismissed notifications (localStorage)

## Settings Page

- [x] T25 — Settings page scaffold at /dashboard/settings
- [x] T26 — Edit profile (name, email) — backend: PATCH /auth/profile
- [x] T27 — Change password — backend: PATCH /auth/password
- [x] T28 — Notification preferences (budget alert threshold %)
- [x] T29 — Connected wallet display + link/unlink wallet
- [x] T30 — Timezone preference (stored in profile, used in analytics dates)

## Backend

- [x] T31 — PATCH /auth/profile endpoint (update name, email, timezone)
- [x] T32 — PATCH /auth/password endpoint (change password)
- [x] T33 — GET /analytics/advertiser/activity — recent events feed
- [x] T34 — GET /analytics/advertiser/top-campaigns scoped to advertiserId
- [x] T35 — Campaign duplicate endpoint POST /campaigns/:id/duplicate
