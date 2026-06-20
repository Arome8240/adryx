# Adryx Frontend

Next.js 15 frontend for the Adryx decentralized advertising platform, built on Stellar.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS (Celina design system)
- **Wallet**: Stellar browser extensions — Freighter, LOBSTR, xBull, Rabet
- **State**: React Hooks
- **Animations**: Framer Motion
- **Icons**: Iconsax React

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_STELLAR_CONTRACT_ID=<soroban-contract-id>
```

## Wallet Support

The app supports all major Stellar browser extension wallets via a unified adapter layer (`src/lib/wallet-adapters.ts`):

| Wallet | Window API | Website |
|--------|-----------|---------|
| Freighter | `window.freighter` | freighter.app |
| LOBSTR | `window.lobstr` | lobstr.co |
| xBull | `window.xBull` | xbull.app |
| Rabet | `window.rabet` | rabet.io |

Install any of these browser extensions and click **Connect Wallet** in the dashboard nav.

## Project Structure

```
src/
├── app/
│   ├── dashboard/        # Advertiser dashboard
│   │   ├── page.tsx      # Overview
│   │   ├── campaigns/    # Campaign management
│   │   ├── analytics/    # Analytics & reporting
│   │   ├── wallet/       # Wallet & payments
│   │   ├── settings/     # Account settings
│   │   └── create/       # New campaign
│   ├── publishers/       # Publisher dashboard
│   │   ├── page.tsx      # Overview
│   │   ├── sites/        # Site management
│   │   ├── placements/   # Ad placements
│   │   ├── analytics/    # Earnings analytics
│   │   └── earnings/     # Earnings & claims
│   └── auth/             # Authentication pages
├── components/
│   ├── dashboard/        # Dashboard shell (Sidebar, Nav, WalletButton)
│   ├── providers/        # WalletProvider, AuthProvider
│   └── ui/               # Shared components (Select, Toast, etc.)
├── hooks/                # API hooks (useAuth, useCampaigns, etc.)
└── lib/
    ├── wallet-adapters.ts # Stellar wallet adapter layer
    └── api.ts             # API client
```

## Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Run production build
pnpm lint         # Lint code
```
