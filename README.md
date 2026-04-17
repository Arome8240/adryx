# Adryx - Decentralized Ad Network on Solana

A full-stack decentralized advertising platform built on Solana blockchain, enabling transparent and automated ad campaigns with on-chain payments.

## 🚀 Quick Start

### Local Development
```bash
# Start all services with Docker
docker compose up -d

# Access the application
Frontend: http://localhost:3000
Backend:  http://localhost:3001
```

### Deploy to Production
```bash
# Prepare for deployment
./scripts/render-deploy.sh

# Follow the deployment guide
# See: RENDER_CHECKLIST.md
```

## 📚 Documentation

### 🚀 Quick Start
- **[QUICKSTART.md](QUICKSTART.md)** - Get started in 5 minutes
- **[DOCKER_RUNNING.md](DOCKER_RUNNING.md)** - Local Docker setup
- **[DEVELOPMENT.md](DEVELOPMENT.md)** - Development workflow

### 🌐 Deployment
- **[RENDER_CHECKLIST.md](RENDER_CHECKLIST.md)** ⭐ Start here for deployment
- **[RENDER_QUICKSTART.md](RENDER_QUICKSTART.md)** - 10-minute deployment guide
- **[RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)** - Comprehensive guide
- **[DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)** - All deployment options

### 🏗️ Architecture
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture
- **[RENDER_ARCHITECTURE.md](RENDER_ARCHITECTURE.md)** - Deployment architecture
- **[BACKEND_PRODUCTION_READINESS.md](BACKEND_PRODUCTION_READINESS.md)** - Backend features

### 🧪 Testing & Production
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Complete testing guide
- **[PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md)** - Production readiness

### 📖 Complete Index
- **[DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)** - All documentation organized by role and task

## 🏗️ Architecture

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Frontend  │────────▶│   Backend   │────────▶│   MongoDB   │
│  (Next.js)  │   API   │  (NestJS)   │  Data   │  (Database) │
└─────────────┘         └──────┬──────┘         └─────────────┘
                               │
                               ▼
                        ┌─────────────┐
                        │   Solana    │
                        │ (Blockchain)│
                        └─────────────┘
```

## ✨ Features

### For Advertisers
- 🎯 Create and manage ad campaigns
- 💰 On-chain escrow for campaign funds
- 📊 Real-time analytics and reporting
- 🔐 Wallet-based authentication
- ⚡ Automated payments to publishers

### For Publishers
- 💵 Monetize websites and apps
- 📈 Track earnings in real-time
- 🔗 Easy SDK integration
- 💳 Direct payments to wallet
- 📊 Detailed analytics

### Technical Features
- 🔒 Secure JWT + Wallet authentication
- ⛓️ Solana smart contracts for escrow
- 🚀 Automated payment processing
- 📊 Real-time interaction tracking
- 🎨 Modern, responsive UI
- 🐳 Docker containerization
- ☁️ Cloud-ready deployment

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Wallet**: Solana Wallet Adapter
- **State**: React Hooks
- **HTTP**: Fetch API

### Backend
- **Framework**: NestJS
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + Solana Wallet
- **Blockchain**: Solana Web3.js + Anchor
- **Validation**: class-validator

### Smart Contracts
- **Language**: Rust
- **Framework**: Anchor
- **Network**: Solana (Devnet/Mainnet)

### Infrastructure
- **Containerization**: Docker
- **Hosting**: Render.com
- **Database**: MongoDB Atlas
- **Blockchain**: Solana

## 📦 Project Structure

```
adryx/
├── apps/
│   ├── backend/          # NestJS API
│   │   ├── src/
│   │   │   ├── modules/  # Feature modules
│   │   │   ├── schemas/  # MongoDB schemas
│   │   │   └── main.ts   # Entry point
│   │   └── Dockerfile
│   └── frontend/         # Next.js app
│       ├── src/
│       │   ├── app/      # App router pages
│       │   ├── components/
│       │   ├── hooks/
│       │   └── lib/
│       └── Dockerfile
├── programs/
│   └── adryx/           # Solana smart contract
│       └── src/
├── scripts/             # Helper scripts
├── docker-compose.yml   # Local development
└── render.yaml         # Render deployment
```

## 🚀 Deployment

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- Solana CLI (for smart contracts)
- MongoDB Atlas account (for production)
- Render account (for hosting)

### Local Development
1. Clone the repository
2. Run `docker compose up -d`
3. Access frontend at http://localhost:3000

### Production Deployment
1. Follow **[RENDER_CHECKLIST.md](RENDER_CHECKLIST.md)**
2. Deploy takes ~40 minutes
3. Free tier available ($0/month)
4. Production tier: $23/month

## 🔐 Environment Variables

### Backend
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<random-secret>
SOLANA_NETWORK=devnet
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_PROGRAM_ID=<program-id>
CORS_ORIGIN=<frontend-url>
```

### Frontend
```env
NEXT_PUBLIC_API_URL=<backend-url>/api/v1
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_SOLANA_PROGRAM_ID=<program-id>
```

## 📊 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login with email
- `POST /api/v1/auth/wallet-login` - Login with wallet

### Campaigns
- `GET /api/v1/campaigns` - List campaigns
- `POST /api/v1/campaigns` - Create campaign
- `GET /api/v1/campaigns/:id` - Get campaign
- `PATCH /api/v1/campaigns/:id` - Update campaign

### Solana
- `GET /api/v1/solana/info` - Get wallet info
- `POST /api/v1/solana/create-campaign` - Create on-chain campaign
- `POST /api/v1/solana/pay-publisher` - Process payment

### Analytics
- `GET /api/v1/analytics/advertiser/dashboard` - Advertiser stats
- `GET /api/v1/analytics/publisher/dashboard` - Publisher stats

[See full API documentation](apps/backend/README.md)

## 🧪 Testing

```bash
# Backend tests
cd apps/backend
pnpm test

# Frontend tests
cd apps/frontend
pnpm test

# Smart contract tests
anchor test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

MIT License - see [LICENSE](LICENSE) file

## 🆘 Support

- **Documentation**: Check the docs folder
- **Issues**: Create a GitHub issue
- **Deployment Help**: See [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)

## 🎯 Roadmap

- [x] Core platform functionality
- [x] Solana integration
- [x] Docker containerization
- [x] Render deployment guides
- [ ] Mobile SDK
- [ ] Advanced analytics
- [ ] Multi-chain support
- [ ] Governance token

## 📈 Status

- **Backend**: ✅ Production Ready
- **Frontend**: ✅ Production Ready
- **Smart Contracts**: ✅ Deployed to Devnet
- **Docker**: ✅ Running
- **Documentation**: ✅ Complete

## 🌟 Features in Detail

### Campaign Management
- Create campaigns with budget and targeting
- Automatic escrow on Solana blockchain
- Real-time budget tracking
- Performance analytics

### Payment Processing
- Automated payment distribution
- On-chain verification
- Failed payment retry mechanism
- Transaction history

### Publisher Integration
- Simple SDK integration
- Multiple ad formats
- Real-time earnings tracking
- Instant withdrawals

### Security
- JWT authentication
- Wallet signature verification
- CORS protection
- Rate limiting
- Input validation

## 💰 Pricing

### Free Tier (Development)
- All features included
- Services spin down after 15 min
- Perfect for testing
- **Cost**: $0/month

### Production Tier
- No spin-down
- Better performance
- Custom domain support
- **Cost**: $23/month

## 🔗 Links

- **Live Demo**: Coming soon
- **Documentation**: This repository
- **Smart Contract**: [View on Solscan](https://solscan.io/account/Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS?cluster=devnet)

---

Built with ❤️ using Solana, Next.js, and NestJS
