# Development Guide

## Two Ways to Develop

### Option 1: Development Mode (Recommended) ⚡

Hot-reload enabled! Changes reflect immediately without rebuilding.

```bash
# Start backend + database with hot-reload
make dev-up

# In another terminal, start frontend locally
cd apps/frontend
pnpm dev
```

**What you get:**
- ✅ Backend hot-reload (changes in `apps/backend/src` reflect immediately)
- ✅ Frontend hot-reload (Next.js dev server)
- ✅ Database on port 5433
- ✅ Fast development cycle

**Access:**
- Frontend: http://localhost:3000 (with hot-reload)
- Backend: http://localhost:3001 (with hot-reload)
- Database: localhost:5433

**Stop:**
```bash
make dev-down
# And Ctrl+C the frontend terminal
```

---

### Option 2: Production Mode (Full Docker)

Everything in Docker, but requires rebuild for changes.

```bash
# Start all services
make docker-up
```

**What you get:**
- ✅ Complete production-like environment
- ✅ All services in Docker
- ❌ No hot-reload - must rebuild for changes

**When to rebuild:**
```bash
# After making changes
docker compose build
docker compose up -d

# Or use the shortcut
make docker-rebuild
```

---

## Quick Reference

### Development Commands

```bash
# Start dev environment (backend + DB)
make dev-up

# Stop dev environment
make dev-down

# View logs
make docker-logs

# Start frontend locally
cd apps/frontend && pnpm dev

# Start backend locally (without Docker)
cd apps/backend && pnpm start:dev
```

### Production Commands

```bash
# Start all services
make docker-up

# Stop all services
make docker-down

# Rebuild after changes
make docker-rebuild

# Clean everything
make docker-clean
```

### Database Commands

```bash
# Access database shell
make shell-db

# Backup database
make backup-db

# View all containers
make ps
```

---

## File Changes & Hot-Reload

### Development Mode (make dev-up)

| File Type | Hot-Reload? | Action Needed |
|-----------|-------------|---------------|
| Frontend (`apps/frontend/src/**`) | ✅ Yes | None - auto-reload |
| Backend (`apps/backend/src/**`) | ✅ Yes | None - auto-reload |
| Backend `package.json` | ❌ No | Rebuild: `docker compose -f docker-compose.dev.yml up -d --build` |
| Frontend `package.json` | ❌ No | Restart: `pnpm install` in frontend terminal |
| Dockerfile | ❌ No | Rebuild container |

### Production Mode (make docker-up)

| File Type | Hot-Reload? | Action Needed |
|-----------|-------------|---------------|
| Any code change | ❌ No | `make docker-rebuild` |
| Package.json | ❌ No | `make docker-rebuild` |
| Dockerfile | ❌ No | `make docker-rebuild` |

---

## Recommended Workflow

1. **Start development environment:**
   ```bash
   make dev-up
   ```

2. **Start frontend in another terminal:**
   ```bash
   cd apps/frontend
   pnpm dev
   ```

3. **Make changes** - they'll reflect immediately!

4. **View logs if needed:**
   ```bash
   # Backend logs
   docker logs -f adryx-backend-dev
   
   # Frontend logs are in your terminal
   ```

5. **When done:**
   ```bash
   make dev-down
   # Ctrl+C in frontend terminal
   ```

---

## Troubleshooting

### Port Already in Use

If you see "port already in use" errors:

```bash
# Check what's using the port
sudo lsof -i :3000  # Frontend
sudo lsof -i :3001  # Backend
sudo lsof -i :5433  # Database

# Stop existing containers
make docker-down
make dev-down
```

### Changes Not Reflecting

**Development mode:**
- Frontend: Check if `pnpm dev` is running
- Backend: Check logs: `docker logs -f adryx-backend-dev`

**Production mode:**
- You must rebuild: `make docker-rebuild`

### Database Connection Issues

```bash
# Check if database is running
docker ps | grep postgres

# Check database logs
docker logs adryx-postgres-dev

# Restart database
docker compose -f docker-compose.dev.yml restart postgres
```

---

## Environment Variables

### Backend (.env)

Create `apps/backend/.env` for local development:

```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5433
DB_DATABASE=adryx
DB_USERNAME=adryx
DB_PASSWORD=adryx_password
```

### Frontend (.env.local)

Create `apps/frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Tips

1. **Use dev mode for active development** - it's much faster
2. **Use production mode to test the full stack** before deploying
3. **Keep frontend running locally** in dev mode for best hot-reload experience
4. **Check logs frequently** when debugging: `docker logs -f <container-name>`
5. **Clean up regularly**: `make docker-clean` to free up space
