# Agentic Engineering Grant Draft

Submit here: https://superteam.fun/earn/grants/agentic-engineering

This draft is based on the repo at `github.com/Arome8240/adryx` plus the exported AI session transcripts in this project root.

## Step 1: Basics

**Project Title**
> Adryx

**One Line Description**
> Adryx is a Solana-based ad network that lets advertisers fund campaigns with on-chain escrow and lets publishers monetize websites and apps with transparent analytics and wallet-native payouts.

**TG username**
> t.me/devarome

**Wallet Address**
> 7caDoXn1NoswwS6SaCFkkjd4JSc4YRX9B3RUYBHKQqX3

## Step 2: Details

**Project Details**
> Adryx is building a decentralized advertising network on Solana for two sides of the market: advertisers who want transparent campaign funding and performance tracking, and publishers who want a cleaner monetization layer than opaque Web2 ad networks. The core problem is that traditional ad platforms hide pricing, attribution, payout logic, and fraud handling behind closed systems, while Web3 apps still lack a native monetization stack that feels verifiable and programmable.
>
> The current implementation is already a real full-stack product, not just a contract repo. The project includes a Next.js frontend with advertiser dashboard flows for campaign creation, wallet connection, analytics, and campaign funding, plus publisher-facing routes for placements, earnings, analytics, site management, settings, and integration. On the backend, the NestJS API covers authentication, campaigns, placements, sites, interactions, analytics, Solana payment flows, and user management. On-chain, the Anchor program defines campaign escrow, top-ups, publisher payouts, withdrawals, earnings claims, and campaign toggling.
>
> This grant would help push Adryx from a strong repo and devnet-oriented implementation into a cleaner public beta with verified end-to-end flows, stronger publisher integration, and proof that on-chain ad funding plus transparent payout rails can work for real Solana-native growth use cases. The immediate target is a pilot-ready devnet release with a confirmed deployed program ID, public documentation, and external publisher integrations.

**Deadline**
> May 10, 2026 (Asia/Calcutta)

**Proof of Work**
> - GitHub repo: https://github.com/Arome8240/adryx
> - The repo currently has 44 commits and a recent implementation burst on April 17, 2026 covering wallet connectivity, campaign management, auth guards, analytics, Dockerization, and deployment documentation.
> - Frontend product surfaces already exist for `/dashboard`, `/dashboard/campaigns`, `/dashboard/create`, `/dashboard/analytics`, `/dashboard/wallet`, `/publishers`, `/publishers/sites`, `/publishers/placements`, `/publishers/earnings`, `/publishers/analytics`, `/publishers/integrate`, and `/publishers/settings`.
> - Backend modules are implemented for `auth`, `campaigns`, `interactions`, `placements`, `sites`, `analytics`, `solana`, and `users`.
> - The Anchor program includes `initialize`, `create_campaign_escrow`, `fund_campaign`, `pay_publisher`, `withdraw_campaign`, `claim_earnings`, and `toggle_campaign`.
> - AI-assisted development proof has already been exported into this repo root as `claude-session.jsonl` and `codex-session.jsonl`.
> - Important accuracy note: the repo documentation is inconsistent about whether the contract is already deployed to devnet. I have intentionally not claimed a live Solscan deployment in this draft. If you have the real deployed program ID or a public demo URL, add it here before submitting.

**Personal X Profile**
> x.com/aromedev

**Personal GitHub Profile**
> github.com/Arome8240

**Colosseum Crowdedness Score**
> Go to https://colosseum.com/copilot, get the project's Crowdedness Score, take a screenshot, upload it to a public Google Drive link, and paste that public link into the form.

**AI Session Transcript**
> Attach the exported session files from this project root: `claude-session.jsonl` and `codex-session.jsonl`.

## Step 3: Milestones

**Goals and Milestones**
> 1. By May 3, 2026: replace placeholder Solana program configuration with the real deployed devnet program ID, run a clean devnet smoke test, and document the verified contract flow.
> 2. By May 6, 2026: finish publisher integration polish, tighten the SDK and integration path, and complete the missing publisher/dashboard actions needed for pilot usage.
> 3. By May 8, 2026: complete an end-to-end devnet campaign flow from advertiser funding to publisher payout, with transaction evidence, updated docs, and a walkthrough demo.
> 4. By May 10, 2026: launch a public devnet beta for Adryx with pilot publisher integrations, public setup documentation, and a grant-ready proof-of-work package.

**Primary KPI**
> 5 pilot publisher integrations using Adryx on devnet by May 10, 2026. If you prefer a usage metric instead, we can swap this for campaigns created, payouts processed, or verified interactions recorded.

**Final tranche checkbox**
> Be ready to submit the Colosseum project link, the GitHub repo, and your AI subscription receipt for the final tranche.

## Remaining Inputs To Finalize

- Telegram username in `t.me/<username>` format
- Colosseum Crowdedness Score screenshot link
- Optional but useful: real deployed devnet program ID, public demo URL, or short demo video link

Submit here: https://superteam.fun/earn/grants/agentic-engineering
