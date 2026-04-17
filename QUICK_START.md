# Adryx - Quick Start Guide ⚡

## 🚀 Get Running in 3 Steps

### 1. Start Docker
```bash
make docker-up
```

### 2. Wait for Build
First time: ~5-10 minutes  
Subsequent: ~30 seconds

### 3. Open Browser
- Frontend: http://localhost:3000
- Backend: http://localhost:3001/api/docs

## 📱 Test the Platform

### Setup Phantom Wallet
1. Install Phantom extension
2. Switch to Devnet (Settings → Developer → Testnet Mode)
3. Get devnet SOL:
   ```bash
   solana airdrop 2 YOUR_ADDRESS --url devnet
   ```

### Create Your First Campaign
1. Go to http://localhost:3000/dashboard
2. Click "Connect Wallet"
3. Click "Create Campaign"
4. Fill in details:
   - Name: "Test Campaign"
   - Format: Banner
   - Budget: 1 SOL
   - Dates: Today → Next month
   - Target URL: https://example.com
5. Submit
6. Click "Fund Campaign"
7. Enter 1 SOL
8. Approve in Phantom
9. Done! Campaign is now active ✅

## 🛠️ Common Commands

```bash
# Start
make docker-up

# Stop
make docker-down

# View logs
make docker-logs

# Rebuild
make docker-rebuild

# Clean everything
make docker-clean

# Check status
docker compose ps
```

## 📊 Access Points

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Main application |
| Backend | http://localhost:3001 | API server |
| API Docs | http://localhost:3001/api/docs | Swagger UI |
| MongoDB | localhost:27017 | Database |

## 🔑 Default Credentials

### MongoDB
- Username: `adryx`
- Password: `adryx_password`
- Database: `adryx`

### JWT Secret
- Default: `your-secret-key-change-in-production`
- Change in production!

## 🐛 Troubleshooting

### Docker not running?
```bash
# Start Docker Desktop
# Then: make docker-up
```

### Port already in use?
```bash
# Check what's using the port
lsof -i :3000
lsof -i :3001

# Stop the process or change ports in docker-compose.yml
```

### Build failed?
```bash
make docker-clean
make docker-up
```

### Can't connect wallet?
1. Check Phantom is on Devnet
2. Check you have devnet SOL
3. Refresh the page

## 📚 Documentation

- `FINAL_SUMMARY.md` - Complete overview
- `DOCKER_RUN.md` - Docker details
- `BACKEND_IMPLEMENTATION_COMPLETE.md` - Backend API
- `FRONTEND_INTEGRATION_COMPLETE.md` - Frontend
- `SMART_CONTRACT_COMPLETE.md` - Solana program

## 🎯 What's Working

✅ User registration & login  
✅ Campaign creation  
✅ Campaign funding with SOL  
✅ Dashboard metrics  
✅ Wallet integration  
✅ API documentation  
✅ Docker deployment  

## 🔜 What's Next

1. Deploy smart contract to devnet
2. Connect backend to real contract
3. Complete analytics pages
4. Add publisher integration
5. Deploy to production

## 💡 Tips

- Use `make` commands - they're easier
- Check logs first when debugging
- Rebuild after code changes
- Keep devnet SOL handy for testing
- Use Swagger docs to test API

## 🆘 Need Help?

1. Check logs: `make docker-logs`
2. View status: `docker compose ps`
3. Read docs: `FINAL_SUMMARY.md`
4. Rebuild: `make docker-rebuild`

---

**You're all set!** Start building with Adryx 🚀
