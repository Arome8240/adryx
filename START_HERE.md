# 🚀 How to Start Adryx

## ⚠️ Docker Desktop is Not Running

You have Docker Desktop installed but it's not currently running.

### Start Docker Desktop

**On Linux:**

1. **Open Docker Desktop from your applications menu**
   - Look for "Docker Desktop" in your app launcher
   - Or run: `systemctl --user start docker-desktop`

2. **Wait for Docker Desktop to fully start**
   - You should see a whale icon appear
   - The icon will stop animating when ready

3. **Verify Docker is running:**
   ```bash
   docker info
   ```
   You should see server information without errors.

### Then Start Adryx

Once Docker Desktop is running:

```bash
# Option 1: Using Makefile
make docker-up

# Option 2: Using Docker Compose
docker compose up -d

# Option 3: Using helper script
./scripts/docker-start.sh
```

### Access Your Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Docs**: http://localhost:3001/api/docs
- **Publishers Dashboard**: http://localhost:3000/publishers

---

## 🔄 Alternative: Run Without Docker

If you prefer not to use Docker, you can run locally:

### 1. Install PostgreSQL

```bash
# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql

# Create database
sudo -u postgres createdb adryx
sudo -u postgres psql -c "CREATE USER adryx WITH PASSWORD 'adryx_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE adryx TO adryx;"
```

### 2. Configure Environment

Create `apps/backend/.env`:
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=adryx
DATABASE_USER=adryx
DATABASE_PASSWORD=adryx_password
PORT=3001
```

Create `apps/frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Start Services

**Terminal 1 - Backend:**
```bash
cd apps/backend
pnpm start:dev
```

**Terminal 2 - Frontend:**
```bash
cd apps/frontend
pnpm dev
```

---

## 📚 More Help

- [QUICKSTART.md](./QUICKSTART.md) - Quick reference guide
- [DOCKER.md](./DOCKER.md) - Detailed Docker instructions
- [CODEBASE_INDEX.md](./CODEBASE_INDEX.md) - Project architecture

---

## 🐛 Troubleshooting

### "Cannot connect to Docker daemon"

This means Docker Desktop is not running. Start it from your applications menu.

### Docker Desktop Won't Start

1. Check system requirements
2. Restart your computer
3. Check Docker Desktop logs: `~/.docker/desktop/log/`
4. Reinstall Docker Desktop if needed

### Port Already in Use

If ports 3000, 3001, or 5432 are in use:

```bash
# Find what's using the port
sudo lsof -i :3000
sudo lsof -i :3001
sudo lsof -i :5432

# Kill the process or change ports in docker-compose.yml
```

---

## ✅ Quick Check

Run this to verify your setup:

```bash
# Check Docker
docker --version
docker compose version

# Check Node.js
node --version
pnpm --version

# Check if Docker is running
docker info
```
