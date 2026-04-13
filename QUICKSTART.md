# Adryx Quick Start Guide

## 🚀 Run with Docker (Recommended)

### One Command Start

```bash
./scripts/docker-start.sh
```

Or:

```bash
docker-compose up -d
```

### Access the Application

- **Frontend (Landing + Dashboard)**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api/docs
- **Publishers Dashboard**: http://localhost:3000/publishers
- **Advertisers Dashboard**: http://localhost:3000/dashboard

### Useful Commands

```bash
# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Stop services
docker-compose down

# Stop and remove all data
docker-compose down -v

# Restart a service
docker-compose restart backend

# Rebuild and restart
docker-compose up -d --build
```

---

## 💻 Run Locally (Development)

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Start Database (Docker)

```bash
docker-compose up postgres -d
```

Or install PostgreSQL locally and create a database named `adryx`.

### 3. Configure Environment

**Backend** (`apps/backend/.env`):
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=adryx
DATABASE_USER=adryx
DATABASE_PASSWORD=adryx_password
PORT=3001
```

**Frontend** (`apps/frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 4. Start Services

**Terminal 1 - Backend:**
```bash
cd apps/backend
pnpm install
pnpm start:dev
```

**Terminal 2 - Frontend:**
```bash
cd apps/frontend
pnpm install
pnpm dev
```

### 5. Access the Application

- Frontend: http://localhost:3000
- Backend: http://localhost:3001

---

## 🔧 Development Mode with Docker

Start only the database, run backend/frontend locally:

```bash
# Start database only
docker-compose up postgres -d

# Run backend locally
cd apps/backend
pnpm install
pnpm start:dev

# Run frontend locally (in another terminal)
cd apps/frontend
pnpm install
pnpm dev
```

Or use the development compose file:

```bash
# Start backend + database with hot-reload
docker-compose -f docker-compose.dev.yml up -d

# Run frontend locally
cd apps/frontend
pnpm dev
```

---

## 📊 Database Management

### Connect to Database

```bash
# Using Docker
docker exec -it adryx-postgres psql -U adryx -d adryx

# Using local psql
psql -h localhost -U adryx -d adryx
```

### Backup Database

```bash
docker exec adryx-postgres pg_dump -U adryx adryx > backup.sql
```

### Restore Database

```bash
docker exec -i adryx-postgres psql -U adryx adryx < backup.sql
```

---

## 🛠️ Troubleshooting

### Port Already in Use

If ports are already in use, modify `docker-compose.yml`:

```yaml
services:
  frontend:
    ports:
      - "3002:3000"  # Change 3002 to any available port
  backend:
    ports:
      - "3003:3000"  # Change 3003 to any available port
```

### Database Connection Failed

```bash
# Check if database is running
docker-compose ps

# View database logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

### Frontend Build Failed

Ensure `next.config.ts` has:
```typescript
const nextConfig: NextConfig = {
  output: 'standalone',
};
```

### Clear Everything

```bash
# Stop and remove everything
docker-compose down -v --rmi all

# Rebuild from scratch
docker-compose up -d --build
```

---

## 📚 Next Steps

1. **Explore the API**: http://localhost:3001/api/docs
2. **Check Publishers Dashboard**: http://localhost:3000/publishers
3. **Check Advertisers Dashboard**: http://localhost:3000/dashboard
4. **Read Full Documentation**: [DOCKER.md](./DOCKER.md)
5. **Review Codebase**: [CODEBASE_INDEX.md](./CODEBASE_INDEX.md)

---

## 🎯 Common Tasks

### Add a New Feature

1. Create feature branch
2. Make changes in `apps/frontend` or `apps/backend`
3. Test locally: `pnpm dev:frontend` or `pnpm dev:backend`
4. Test with Docker: `docker-compose up -d --build`

### Run Tests

```bash
# Backend tests
cd apps/backend
pnpm test

# Frontend tests (if configured)
cd apps/frontend
pnpm test
```

### Build for Production

```bash
# Build all
pnpm build

# Or build individually
cd apps/backend && pnpm build
cd apps/frontend && pnpm build
```

---

## 🐳 Docker Cheat Sheet

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f [service]

# Rebuild
docker-compose up -d --build

# Execute command in container
docker-compose exec backend sh
docker-compose exec frontend sh

# View running containers
docker-compose ps

# Remove volumes (clears data)
docker-compose down -v
```

---

## 📞 Need Help?

- Check [DOCKER.md](./DOCKER.md) for detailed Docker instructions
- Check [README.md](./README.md) for project overview
- Check [CODEBASE_INDEX.md](./CODEBASE_INDEX.md) for architecture details
