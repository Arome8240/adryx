# Start Adryx with Docker 🚀

## Prerequisites

1. **Install Docker Desktop**
   - Download from: https://www.docker.com/products/docker-desktop
   - Install and start Docker Desktop
   - Verify: `docker --version`

2. **Start Docker**
   - Open Docker Desktop application
   - Wait for Docker to start (whale icon in system tray)
   - Verify: `docker info`

## Quick Start (3 Commands)

```bash
# 1. Start Docker Desktop (if not running)
# Open Docker Desktop app

# 2. Build and start all services
make docker-up

# 3. Open your browser
# Frontend: http://localhost:3000
# Backend:  http://localhost:3001/api/docs
```

## What Gets Started

When you run `make docker-up`, Docker will:

1. **Pull/Build Images** (~5-10 minutes first time)
   - MongoDB 7 image
   - Build backend (Node.js + NestJS)
   - Build frontend (Next.js)

2. **Start Services**
   - MongoDB on port 27017
   - Backend API on port 3001
   - Frontend on port 3000

3. **Create Network**
   - Services can communicate internally
   - Exposed ports for external access

## Step-by-Step Instructions

### 1. Verify Docker is Running

```bash
docker info
```

If you see an error, start Docker Desktop first.

### 2. Build and Start Services

```bash
# Option 1: Using Makefile (recommended)
make docker-up

# Option 2: Using docker compose directly
docker compose up -d --build
```

**First time build takes 5-10 minutes**. Subsequent starts are much faster.

### 3. Check Services are Running

```bash
# View all containers
docker compose ps

# Should show:
# adryx-mongodb   running
# adryx-backend   running
# adryx-frontend  running
```

### 4. View Logs (Optional)

```bash
# All services
make docker-logs

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mongodb
```

### 5. Access the Application

Open your browser:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api/v1
- **API Docs**: http://localhost:3001/api/docs

## Testing the Setup

### 1. Test Backend Health

```bash
curl http://localhost:3001/api/v1/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

### 2. Test Frontend

Open http://localhost:3000 in your browser. You should see the Adryx homepage.

### 3. Test Database

```bash
docker compose exec mongodb mongosh -u adryx -p adryx_password --authenticationDatabase admin
```

## Using the Application

### 1. Connect Wallet

1. Install Phantom wallet extension
2. Switch to Devnet:
   - Settings → Developer Settings
   - Enable "Testnet Mode"
   - Select "Devnet"
3. Get devnet SOL:
   ```bash
   solana airdrop 2 YOUR_WALLET_ADDRESS --url devnet
   ```

### 2. Create Campaign

1. Go to http://localhost:3000/dashboard
2. Click "Connect Wallet"
3. Click "Create Campaign"
4. Fill in campaign details
5. Submit

### 3. Fund Campaign

1. Go to Campaigns page
2. Find your draft campaign
3. Click "Fund Campaign"
4. Enter SOL amount
5. Approve transaction in Phantom

## Common Issues & Solutions

### Issue: "Docker is not running"

**Solution:**
```bash
# Start Docker Desktop application
# Wait for it to fully start
# Try again: make docker-up
```

### Issue: "Port already in use"

**Solution:**
```bash
# Check what's using the port
lsof -i :3000  # Frontend
lsof -i :3001  # Backend
lsof -i :27017 # MongoDB

# Stop the conflicting service or change ports in docker-compose.yml
```

### Issue: "Build failed"

**Solution:**
```bash
# Clean everything and rebuild
make docker-clean
make docker-up
```

### Issue: "Backend can't connect to MongoDB"

**Solution:**
```bash
# Check MongoDB is healthy
docker compose ps

# Restart backend
docker compose restart backend

# View backend logs
docker compose logs backend
```

### Issue: "Frontend shows connection error"

**Solution:**
```bash
# Check backend is running
curl http://localhost:3001/api/v1/health

# Check environment variables
docker compose exec frontend env | grep NEXT_PUBLIC

# Restart frontend
docker compose restart frontend
```

## Stopping the Application

### Keep Data (Recommended)
```bash
make docker-down
```

This stops containers but keeps:
- MongoDB data
- Docker images

### Remove Everything
```bash
make docker-clean
```

This removes:
- Containers
- Volumes (MongoDB data)
- Images

## Development Workflow

### Making Changes

1. **Edit code** in your editor
2. **Rebuild** the changed service:
   ```bash
   # Backend changes
   docker compose up -d --build backend
   
   # Frontend changes
   docker compose up -d --build frontend
   
   # Both
   make docker-rebuild
   ```

### Viewing Logs

```bash
# Follow all logs
make docker-logs

# Follow specific service
docker compose logs -f backend
```

### Accessing Containers

```bash
# Backend shell
docker compose exec backend sh

# Frontend shell
docker compose exec frontend sh

# MongoDB shell
docker compose exec mongodb mongosh -u adryx -p adryx_password --authenticationDatabase admin
```

## Useful Commands

```bash
# Start services
make docker-up

# Stop services
make docker-down

# View logs
make docker-logs

# Rebuild services
make docker-rebuild

# Clean everything
make docker-clean

# Check status
docker compose ps

# View resource usage
docker stats
```

## Environment Variables

### Backend (.env)
```env
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb://adryx:adryx_password@mongodb:27017/adryx?authSource=admin
JWT_SECRET=your-secret-key-change-in-production
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_PROGRAM_ID=Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
```

## Next Steps

1. ✅ Start Docker Desktop
2. ✅ Run `make docker-up`
3. ✅ Wait for build to complete
4. ✅ Open http://localhost:3000
5. ✅ Connect Phantom wallet (devnet)
6. ✅ Create and fund a campaign

## Support

If you encounter issues:

1. Check logs: `make docker-logs`
2. Verify Docker is running: `docker info`
3. Check service status: `docker compose ps`
4. Try rebuilding: `make docker-rebuild`
5. Clean start: `make docker-clean && make docker-up`

## Architecture

```
┌─────────────────────────────────────────────┐
│           Docker Network (adryx-network)     │
│                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Frontend │  │ Backend  │  │ MongoDB  │  │
│  │  :3000   │→ │  :3001   │→ │  :27017  │  │
│  └──────────┘  └──────────┘  └──────────┘  │
│       ↓              ↓              ↓        │
└───────┼──────────────┼──────────────┼────────┘
        │              │              │
        ↓              ↓              ↓
   localhost:3000  localhost:3001  localhost:27017
```

Enjoy building with Adryx! 🚀
