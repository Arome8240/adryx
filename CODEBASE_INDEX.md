# Adryx Codebase Index

> Last updated: April 13, 2026

## Overview

Adryx is a decentralized advertising network built on Solana that provides transparent, permissionless monetization for Web2/Web3 apps with on-chain ad tracking, verifiable analytics, and user rewards.

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS 4, Framer Motion
- **Backend**: NestJS 11, TypeScript
- **Blockchain**: Solana (Anchor 0.30.1)
- **Monorepo**: pnpm workspaces
- **Package Manager**: pnpm 10.30.1

---

## Project Structure

```
adryx/
├── apps/                    # Application layer
│   ├── frontend/           # Next.js dashboard & landing page
│   ├── backend/            # NestJS API server
│   └── contracts/          # (placeholder)
├── programs/               # Solana smart contracts
│   └── adryx/             # Main Anchor program
├── packages/              # Shared SDK packages
│   ├── core/              # Core SDK logic
│   ├── react/             # React SDK
│   └── react-native/      # React Native SDK
└── [config files]         # Root configuration
```

---

## Applications

### Frontend (`apps/frontend/`)

**Purpose**: Marketing landing page + advertiser/publisher dashboard

**Tech**: Next.js 16 (App Router), React 19, Tailwind CSS 4, Framer Motion, Recharts

**Key Routes**:
- `/` - Landing page with Hero, Problem, Solution, Features, How It Works, CTA
- `/dashboard` - Main dashboard with metrics overview
- `/dashboard/campaigns` - Campaign management
- `/dashboard/create` - Create new campaigns
- `/dashboard/analytics` - Detailed analytics
- `/dashboard/wallet` - Wallet management

**Key Components**:
- Landing: `Navbar`, `Hero`, `Problem`, `Solution`, `Features`, `HowItWorks`, `ForWho`, `CTA`, `Footer`
- Dashboard: `Sidebar`, `DashboardNav`, `MetricCard`, `PerformanceChart`, `StatusBadge`, `Toast`

**Mock Data**: `src/lib/mock-data.ts` - Contains sample campaigns, metrics, and analytics data

**Scripts**:
```bash
pnpm dev:frontend  # Start dev server (port 3000)
pnpm build         # Production build
```

### Backend (`apps/backend/`)

**Purpose**: API server for off-chain operations (currently scaffolded)

**Tech**: NestJS 11, TypeScript

**Structure**:
- `src/main.ts` - Bootstrap (port 3000)
- `src/app.module.ts` - Root module
- `src/app.controller.ts` - Basic controller
- `src/app.service.ts` - Basic service

**Status**: Minimal scaffold, ready for expansion

**Scripts**:
```bash
pnpm dev:backend   # Start dev server with watch mode
pnpm build         # Build for production
pnpm test          # Run Jest tests
```

---

## Blockchain Layer

### Solana Program (`programs/adryx/`)

**Purpose**: On-chain ad campaign management, interaction tracking, and reward distribution

**Tech**: Anchor 0.30.1, Rust

**Program ID**: `Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS`

**Instructions** (scaffolded):

1. **`create_campaign`**
   - Registers new ad campaign on-chain
   - Params: `campaign_id: String`, `budget_lamports: u64`
   - Accounts: `advertiser` (signer), `system_program`

2. **`record_interaction`**
   - Records ad impressions or clicks
   - Params: `campaign_id: String`, `interaction_type: u8` (0=impression, 1=click)
   - Accounts: `authority` (signer)

3. **`distribute_reward`**
   - Distributes SOL micro-rewards to users
   - Params: `campaign_id: String`, `amount_lamports: u64`
   - Accounts: `authority` (signer), `system_program`

**Status**: All instructions are TODO stubs, ready for implementation

**Config**: `Anchor.toml` - Configured for localnet testing

**Build**:
```bash
anchor build
anchor test
```

---

## SDK Packages

### Core SDK (`packages/core/`)

**Purpose**: Platform-agnostic core logic for Adryx SDK

**Status**: Minimal scaffold (`hello()` function)

**Exports**: ESM + CJS + TypeScript types

**Build**: `tsup` for bundling

### React SDK (`packages/react/`)

**Purpose**: React integration for web apps

**Status**: Minimal scaffold (`<AdBanner />` component)

**Peer Dependencies**: React >=17.0.0

**Exports**: ESM + CJS + TypeScript types

### React Native SDK (`packages/react-native/`)

**Purpose**: React Native integration for mobile apps

**Status**: Minimal scaffold (`<AdBanner />` component)

**Peer Dependencies**: React >=17.0.0, React Native >=0.70.0

**Exports**: ESM + CJS + TypeScript types

---

## Configuration Files

### Root Level

- **`package.json`** - Workspace root, defines monorepo scripts
- **`pnpm-workspace.yaml`** - Defines workspace packages (`apps/*`, `packages/*`)
- **`tsconfig.base.json`** - Base TypeScript config
- **`Anchor.toml`** - Anchor workspace config (Solana)
- **`Cargo.toml`** - Rust workspace config
- **`.changeset/config.json`** - Changesets for versioning

### Docker

- **`docker-compose.yml`** - Production Docker Compose configuration
- **`docker-compose.dev.yml`** - Development Docker Compose configuration
- **`apps/backend/Dockerfile`** - Backend production Docker image
- **`apps/backend/Dockerfile.dev`** - Backend development Docker image
- **`apps/frontend/Dockerfile`** - Frontend production Docker image
- **`.dockerignore`** - Files to exclude from Docker builds
- **`DOCKER.md`** - Comprehensive Docker documentation
- **`QUICKSTART.md`** - Quick start guide for Docker and local development
- **`scripts/docker-start.sh`** - Helper script to start Docker services

### Scripts (Root)

```bash
pnpm dev:frontend      # Start Next.js dev server
pnpm dev:backend       # Start NestJS dev server
pnpm build             # Build all packages
pnpm test              # Run all tests
pnpm lint              # Lint all packages
pnpm release           # Build and publish with changesets
```

---

## Key Features (Current State)

### ✅ Implemented
- Landing page with full marketing sections
- Dashboard UI with metrics, charts, campaign tables
- Solana program scaffold with 3 core instructions
- SDK package structure (core, react, react-native)
- NestJS backend scaffold
- Monorepo setup with pnpm workspaces

### 🚧 In Progress / TODO
- Solana program implementation (campaign creation, tracking, rewards)
- React SDK implementation (ad components, tracking hooks)
- Backend API endpoints (campaign CRUD, analytics)
- Wallet integration (Phantom, Solflare)
- On-chain transaction flows
- Real-time analytics from blockchain data

---

## Development Workflow

### Prerequisites
- Node.js 20+
- pnpm 10+
- Rust + Solana CLI + Anchor CLI 0.30+ (for Solana programs)

**OR** use Docker (recommended):
- Docker 20.10+
- Docker Compose 2.0+

### Quick Start with Docker

```bash
# Start all services (frontend, backend, database)
./scripts/docker-start.sh

# Or manually
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Docs: http://localhost:3001/api/docs
- Database: localhost:5432

See [DOCKER.md](./DOCKER.md) and [QUICKSTART.md](./QUICKSTART.md) for details.

### Quick Start (Local Development)

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Start database** (Docker):
   ```bash
   docker-compose up postgres -d
   ```

3. **Run frontend**:
   ```bash
   pnpm dev:frontend
   # → http://localhost:3000
   ```

4. **Run backend**:
   ```bash
   pnpm dev:backend
   # → http://localhost:3001
   ```

5. **Build Solana program**:
   ```bash
   anchor build
   anchor test
   ```

### Adding New Features

- **Frontend components**: `apps/frontend/src/components/`
- **Dashboard pages**: `apps/frontend/src/app/dashboard/`
- **Backend modules**: `apps/backend/src/`
- **Solana instructions**: `programs/adryx/src/lib.rs`
- **SDK features**: `packages/[core|react|react-native]/src/`

---

## Architecture Flow

```
┌─────────────────┐
│   Advertisers   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│   Solana Program (Adryx)            │
│   ├── create_campaign               │
│   ├── record_interaction            │
│   └── distribute_reward             │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│   Adryx SDK (React / React Native)  │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│   Publishers & Users                │
└─────────────────────────────────────┘
```

---

## Roadmap

### MVP
- [x] Dashboard UI
- [x] Solana program scaffold
- [ ] React SDK implementation
- [ ] Campaign creation → on-chain
- [ ] Basic impression/click tracking

### Rewards System
- [ ] User opt-in reward flow
- [ ] SOL micro-payment distribution
- [ ] Publisher earnings dashboard

### Advanced
- [ ] Real-time on-chain analytics
- [ ] A/B testing support
- [ ] React Native SDK
- [ ] Multi-network support

---

## License

MIT - See `LICENSE` file

---

## Contact & Resources

- **Repository**: Current workspace
- **Solana Docs**: https://docs.solana.com
- **Anchor Docs**: https://www.anchor-lang.com
- **Next.js Docs**: https://nextjs.org/docs
- **NestJS Docs**: https://docs.nestjs.com
