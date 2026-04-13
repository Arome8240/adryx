# Adryx

**Adryx** is a decentralized advertising network built on Solana. It gives developers a transparent, permissionless monetization layer for Web2 apps, mobile apps, and Web3 dApps — while giving advertisers verifiable, fraud-proof campaign tracking and users the option to earn rewards for their attention.

---

## The Problem

Web2 ad networks are opaque, extractive, and inaccessible to Web3 developers. Publishers earn a fraction of what they're owed, metrics can't be audited, and dApp developers have no monetization path at all.

Adryx fixes this.

---

## Features

- **Cross-platform SDK** — React and React Native SDKs for Web2 and Web3 apps
- **On-chain ad tracking** — Impressions and clicks recorded via a Solana program
- **Transparent analytics** — Every metric is verifiable on-chain, no black boxes
- **Micro-rewards** — Users can opt in to earn SOL for engaging with ads
- **Fraud-resistant** — Cryptographic verification makes click fraud impossible
- **Instant payouts** — Revenue flows directly to publisher wallets in SOL

---

## Architecture

```
Advertisers
    │
    ▼
Solana Program (Adryx)
    │  ├── create_campaign
    │  ├── record_interaction
    │  └── distribute_reward
    │
    ▼
Adryx SDK (React / React Native)
    │
    ▼
Publishers & Users
```

Ad campaigns are registered on-chain. The SDK integrates into any app and reports interactions back to the Solana program. Rewards are distributed transparently based on verified on-chain data.

---

## Tech Stack

| Layer                | Technology                                       |
| -------------------- | ------------------------------------------------ |
| Frontend / Dashboard | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| Mobile SDK           | React Native                                     |
| Backend API          | NestJS 11, TypeScript                            |
| Blockchain           | Solana (Anchor 0.30)                             |
| Monorepo             | pnpm workspaces                                  |

---

## Project Structure

```
adryx/
├── apps/
│   ├── frontend/          # Next.js dashboard & landing page
│   └── backend/           # NestJS API server
├── programs/
│   └── adryx/             # Solana Anchor program
│       └── src/lib.rs     # create_campaign, record_interaction, distribute_reward
├── packages/              # Shared packages (SDK — coming soon)
├── Anchor.toml            # Anchor workspace config
├── Cargo.toml             # Rust workspace
└── package.json           # pnpm workspace root
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 20+
- [pnpm](https://pnpm.io) 10+
- [Rust](https://rustup.rs) (for Solana programs)
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools)
- [Anchor CLI](https://www.anchor-lang.com/docs/installation) 0.30+

**OR** use Docker (recommended for quick start):

- [Docker](https://docs.docker.com/get-docker/) 20.10+
- [Docker Compose](https://docs.docker.com/compose/install/) 2.0+

### Quick Start with Docker

The fastest way to run Adryx:

```bash
# Start all services (frontend, backend, database)
./scripts/docker-start.sh

# Or manually with docker-compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Access the application:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Docs**: http://localhost:3001/api/docs

See [DOCKER.md](./DOCKER.md) for detailed Docker instructions.

### Local Development (without Docker)

### Install dependencies

```bash
pnpm install
```

### Run the frontend

```bash
pnpm dev:frontend
# → http://localhost:3000
```

### Run the backend

```bash
pnpm dev:backend
# → http://localhost:3001
```

### Build the Solana program

```bash
anchor build
```

### Run Solana program tests

```bash
anchor test
```

---

## Roadmap

### MVP

- [x] Dashboard UI (campaigns, analytics, wallet)
- [x] Solana program scaffold (create_campaign, record_interaction, distribute_reward)
- [ ] React SDK — `@adryx/sdk`
- [ ] Campaign creation → on-chain transaction
- [ ] Basic impression/click tracking

### Rewards System

- [ ] User opt-in reward flow
- [ ] SOL micro-payment distribution
- [ ] Publisher earnings dashboard

### Advanced Analytics

- [ ] Real-time on-chain analytics
- [ ] A/B testing support
- [ ] React Native SDK
- [ ] Multi-network support

---

## License

MIT — see [LICENSE](./LICENSE)
