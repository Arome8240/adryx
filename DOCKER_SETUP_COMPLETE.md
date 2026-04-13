# ✅ Docker Setup Complete!

Your Adryx project is now fully configured for Docker deployment.

## 🎉 What's Been Added

### Docker Configuration Files

1. **`docker-compose.yml`** - Production setup with frontend, backend, and PostgreSQL
2. **`docker-compose.dev.yml`** - Development setup with hot-reload
3. **`apps/backend/Dockerfile`** - Production backend image
4. **`apps/backend/Dockerfile.dev`** - Development backend image  
5. **`apps/frontend/Dockerfile`** - Production frontend image (Next.js standalone)
6. **`.dockerignore`** - Optimized Docker builds

### Documentation

1. **`DOCKER.md`** - Comprehensive Docker guide with troubleshooting
2. **`QUICKSTART.md`** - Quick reference for getting started
3. **`Makefile`** - Convenient commands for common tasks

### Helper Scripts

1. **`scripts/docker-start.sh`** - One-command startup script
2. **Environment examples** - `.env.example` files for both apps

### Configuration Updates

1. **`next.config.ts`** - Added `output: 'standalone'` for Docker
2. **`apps/backend/src/app.controller.ts`** - Added `/health` endpoint
3. **`README.md`** - Updated with Docker quick start
4. **`CODEBASE_INDEX.md`** - Added Docker section

---

## 🚀 Quick Start

### Option 1: Using the Helper Script (Easiest)

```bash
# Start everything
./scripts/docker-start.sh

# Or for development mode
./scripts/docker-start.sh dev

# Stop services
./scripts/docker-start.sh stop

# Clean everything
./scripts/docker-start.sh clean
```

### Option 2: Using Docker Compose

```bash
# Production mode
docker-compose up -d

# Development mode
docker-compose -f docker-compose.dev.yml up -d

# Stop services
docker-compose down
```

### Option 3: Using Makefile

```bash
# Start production
make docker-up

# Start development
make dev-up

# View logs
make docker-logs

# Stop services
make docker-down

# Clean everything
make docker-clean
```

---

## 🌐 Access Your Application

Once started, access:

- **Frontend**: http://localhost:3000
  - Landing page: http://localhost:3000
  - Publishers dashboard: http://localhost:3000/publishers
  - Advertisers dashboard: http://localhost:3000/dashboard

- **Backend API**: http://localhost:3001
  - API docs: http://localhost:3001/api/docs
  - Health check: http://localhost:3001/health

- **Database**: localhost:5432
  - Database: `adryx`
  - User: `adryx`
  - Password: `adryx_password`

---

## 📋 Common Commands

### View Logs
```bash
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Restart Services
```bash
docker-compose restart backend
docker-compose restart frontend
```

### Rebuild After Changes
```bash
docker-compose up -d --build
```

### Access Database
```bash
docker exec -it adryx-postgres psql -U adryx -d adryx
```

### Execute Commands in Containers
```bash
docker-compose exec backend sh
docker-compose exec frontend sh
```

---

## 🔧 Development Workflow

### Recommended Setup

1. **Start database with Docker**:
   ```bash
   docker-compose up postgres -d
   ```

2. **Run backend locally** (Terminal 1):
   ```bash
   cd apps/backend
   pnpm install
   pnpm start:dev
   ```

3. **Run frontend locally** (Terminal 2):
   ```bash
   cd apps/frontend
   pnpm install
   pnpm dev
   ```

This gives you hot-reload for both frontend and backend while using Docker for the database.

### Alternative: Full Docker Development

```bash
# Start backend + database with hot-reload
docker-compose -f docker-compose.dev.yml up -d

# Run frontend locally for faster hot-reload
cd apps/frontend && pnpm dev
```

---

## 🛠️ Troubleshooting

### Ports Already in Use

Edit `docker-compose.yml` and change the port mappings:

```yaml
services:
  frontend:
    ports:
      - "3002:3000"  # Change 3002 to any available port
```

### Database Connection Issues

```bash
# Check if database is running
docker-compose ps

# View database logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

### Clear Everything and Start Fresh

```bash
# Stop and remove everything
docker-compose down -v --rmi all

# Rebuild from scratch
docker-compose up -d --build
```

---

## 📚 Next Steps

1. **Configure environment variables**:
   - Copy `apps/backend/.env.example` to `apps/backend/.env`
   - Copy `apps/frontend/.env.example` to `apps/frontend/.env.local`
   - Update values as needed

2. **Explore the API**:
   - Visit http://localhost:3001/api/docs
   - Test endpoints with Swagger UI

3. **Check the dashboards**:
   - Publishers: http://localhost:3000/publishers
   - Advertisers: http://localhost:3000/dashboard

4. **Read the documentation**:
   - [DOCKER.md](./DOCKER.md) - Detailed Docker guide
   - [QUICKSTART.md](./QUICKSTART.md) - Quick reference
   - [CODEBASE_INDEX.md](./CODEBASE_INDEX.md) - Architecture overview

---

## 🎯 Production Deployment

For production deployment:

1. **Set secure environment variables**
2. **Use secrets management** for sensitive data
3. **Configure SSL/TLS** with a reverse proxy (nginx, traefik)
4. **Set up monitoring** and logging
5. **Configure database backups**
6. **Use production-grade PostgreSQL** (managed service recommended)

See [DOCKER.md](./DOCKER.md) for production deployment details.

---

## ✨ Features

Your Docker setup includes:

- ✅ Multi-stage builds for optimized images
- ✅ Health checks for all services
- ✅ Automatic service dependencies
- ✅ Volume persistence for database
- ✅ Development and production configurations
- ✅ Hot-reload support in development mode
- ✅ Swagger API documentation
- ✅ CORS configuration
- ✅ Non-root users for security
- ✅ Standalone Next.js builds

---

## 🤝 Contributing

When adding new features:

1. Test locally first
2. Test with Docker: `docker-compose up -d --build`
3. Update documentation if needed
4. Ensure health checks pass

---

## 📞 Need Help?

- Check [DOCKER.md](./DOCKER.md) for detailed instructions
- Check [QUICKSTART.md](./QUICKSTART.md) for quick reference
- Review [CODEBASE_INDEX.md](./CODEBASE_INDEX.md) for architecture

Happy coding! 🚀
