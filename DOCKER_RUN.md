# Running Adryx with Docker 🐳

## Quick Start

### 1. Start Everything
```bash
make docker-up
```

This will start:
- MongoDB on port 27017
- Backend API on port 3001
- Frontend on port 3000

### 2. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api/v1
- **API Documentation**: http://localhost:3001/api/docs

### 3. Stop Everything
```bash
make docker-down
```

## Detailed Commands

### Start Services
```bash
# Start all services in detached mode
make docker-up

# Or use docker compose directly
docker compose up -d
```

### View Logs
```bash
# View all logs
make docker-logs

# View specific service logs
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mongodb
```

### Rebuild Services
```bash
# Rebuild and restart (after code changes)
make docker-rebuild

# Or
docker compose up -d --build
```

### Stop Services
```bash
# Stop services (keeps data)
make docker-down

# Stop and remove all data
make docker-clean
```

### Check Status
```bash
# View running containers
docker compose ps

# Or
make ps
```

## Environment Variables

The docker-compose.yml uses these environment variables:

### Backend
- `NODE_ENV=production`
- `PORT=3001`
- `MONGODB_URI=mongodb://adryx:adryx_password@mongodb:27017/adryx?authSource=admin`
- `FRONTEND_URL=http://localhost:3000`
- `JWT_SECRET=your-secret-key-change-in-production`
- `SOLANA_RPC_URL=https://api.devnet.solana.com`
- `SOLANA_PROGRAM_ID=Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS`

### Frontend
- `NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1`
- `NEXT_PUBLIC_SOLANA_NETWORK=devnet`
- `NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com`

## Troubleshooting

### Services Won't Start

1. **Check Docker is running**
```bash
docker info
```

2. **Check port availability**
```bash
# Check if ports are in use
lsof -i :3000  # Frontend
lsof -i :3001  # Backend
lsof -i :27017 # MongoDB
```

3. **View service logs**
```bash
docker compose logs backend
docker compose logs frontend
docker compose logs mongodb
```

### Backend Can't Connect to MongoDB

1. **Check MongoDB is healthy**
```bash
docker compose ps
```

2. **Test MongoDB connection**
```bash
docker exec -it adryx-mongodb mongosh -u adryx -p adryx_password --authenticationDatabase admin
```

3. **Restart services**
```bash
docker compose restart backend
```

### Frontend Can't Connect to Backend

1. **Check backend is running**
```bash
curl http://localhost:3001/api/v1/health
```

2. **Check backend logs**
```bash
docker compose logs backend
```

3. **Verify environment variables**
```bash
docker compose exec frontend env | grep NEXT_PUBLIC
```

### Build Failures

1. **Clean and rebuild**
```bash
make docker-clean
make docker-up
```

2. **Check disk space**
```bash
docker system df
```

3. **Prune unused images**
```bash
docker system prune -a
```

## Development Workflow

### Making Code Changes

1. **Backend changes**
```bash
# Rebuild backend only
docker compose up -d --build backend
```

2. **Frontend changes**
```bash
# Rebuild frontend only
docker compose up -d --build frontend
```

3. **Both**
```bash
make docker-rebuild
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

### Database Operations

```bash
# Backup database
docker exec adryx-mongodb mongodump --uri="mongodb://adryx:adryx_password@localhost:27017/adryx?authSource=admin" --out=/backup

# Restore database
docker exec adryx-mongodb mongorestore --uri="mongodb://adryx:adryx_password@localhost:27017/adryx?authSource=admin" /backup/adryx
```

## Production Deployment

### Environment Variables

Create a `.env` file:
```env
JWT_SECRET=your-super-secret-jwt-key-here
MONGODB_PASSWORD=your-secure-password
```

### Update docker-compose.yml

```yaml
environment:
  JWT_SECRET: ${JWT_SECRET}
  MONGODB_URI: mongodb://adryx:${MONGODB_PASSWORD}@mongodb:27017/adryx?authSource=admin
```

### Use Production Build

```bash
docker compose -f docker-compose.prod.yml up -d
```

## Health Checks

All services have health checks:

### Backend
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

### MongoDB
```bash
docker compose exec mongodb mongosh --eval "db.adminCommand('ping')"
```

### Frontend
```bash
curl http://localhost:3000
```

## Monitoring

### View Resource Usage
```bash
docker stats
```

### View Container Details
```bash
docker compose ps
docker inspect adryx-backend
docker inspect adryx-frontend
docker inspect adryx-mongodb
```

## Cleanup

### Remove Everything
```bash
# Stop and remove containers, networks, volumes
make docker-clean

# Or
docker compose down -v --rmi local
```

### Remove Unused Docker Resources
```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove everything unused
docker system prune -a --volumes
```

## Network Configuration

Services communicate via the `adryx-network` bridge network:

- Frontend → Backend: `http://backend:3001`
- Backend → MongoDB: `mongodb://mongodb:27017`

External access:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`
- MongoDB: `localhost:27017`

## Volumes

### MongoDB Data
```bash
# View volume
docker volume inspect adryx_mongodb_data

# Backup volume
docker run --rm -v adryx_mongodb_data:/data -v $(pwd):/backup alpine tar czf /backup/mongodb-backup.tar.gz /data
```

## Tips

1. **Use make commands** - They're easier to remember
2. **Check logs first** - Most issues show up in logs
3. **Rebuild after changes** - Code changes need rebuild
4. **Keep data** - Use `docker-down` not `docker-clean` to keep data
5. **Monitor resources** - Use `docker stats` to check usage

## Next Steps

1. Start the application: `make docker-up`
2. Open http://localhost:3000
3. Connect your Phantom wallet (devnet)
4. Create a campaign
5. Fund it with devnet SOL

Enjoy! 🚀
