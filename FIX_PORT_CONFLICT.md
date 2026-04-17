# Fix Port 27017 Conflict

## Problem
MongoDB is already running on port 27017, preventing Docker from starting.

## Solution

### Option 1: Stop Standalone MongoDB (Recommended)

```bash
# Stop MongoDB service
sudo systemctl stop mongod

# Disable auto-start (optional)
sudo systemctl disable mongod

# Start Docker containers
make docker-up
```

### Option 2: Change Docker MongoDB Port

Edit `docker-compose.yml`:

```yaml
mongodb:
  ports:
    - "27018:27017"  # Change to 27018
```

Then update backend environment:
```yaml
backend:
  environment:
    MONGODB_URI: mongodb://adryx:adryx_password@mongodb:27017/adryx?authSource=admin
    # Note: Internal port stays 27017, external becomes 27018
```

Start containers:
```bash
make docker-up
```

### Option 3: Use Standalone MongoDB

Keep your MongoDB running and don't use Docker MongoDB:

1. Remove MongoDB from `docker-compose.yml`
2. Update backend to connect to localhost:
   ```yaml
   backend:
     environment:
       MONGODB_URI: mongodb://localhost:27017/adryx
   ```
3. Start only backend and frontend:
   ```bash
   docker compose up -d backend frontend
   ```

## Quick Fix (Recommended)

```bash
# 1. Stop MongoDB
sudo systemctl stop mongod

# 2. Start Docker
make docker-up

# 3. Check status
docker compose ps
```

## Verify It's Working

```bash
# Check all containers are running
docker compose ps

# Should show:
# adryx-mongodb   running
# adryx-backend   running  
# adryx-frontend  running

# Test backend
curl http://localhost:3001/api/v1/health

# Open frontend
# http://localhost:3000
```

## Restore Standalone MongoDB Later

If you want to go back to standalone MongoDB:

```bash
# Stop Docker
make docker-down

# Start MongoDB
sudo systemctl start mongod
```
