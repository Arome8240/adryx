# Docker Setup for Adryx

This guide explains how to run Adryx using Docker and Docker Compose.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (version 20.10 or higher)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0 or higher)

## Quick Start

### Production Mode

Run the entire stack (frontend, backend, and database):

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (clears database)
docker-compose down -v
```

Services will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **PostgreSQL**: localhost:5432

### Development Mode

For development with hot-reload:

```bash
# Start only the database
docker-compose -f docker-compose.dev.yml up postgres -d

# Or start backend with hot-reload
docker-compose -f docker-compose.dev.yml up -d

# Run frontend locally (recommended for development)
cd apps/frontend
pnpm install
pnpm dev
```

## Individual Services

### Backend Only

```bash
# Build backend image
docker build -f apps/backend/Dockerfile -t adryx-backend .

# Run backend container
docker run -p 3001:3000 \
  -e DATABASE_HOST=host.docker.internal \
  -e DATABASE_PORT=5432 \
  -e DATABASE_NAME=adryx \
  -e DATABASE_USER=adryx \
  -e DATABASE_PASSWORD=adryx_password \
  adryx-backend
```

### Frontend Only

```bash
# Build frontend image
docker build -f apps/frontend/Dockerfile -t adryx-frontend .

# Run frontend container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:3001 \
  adryx-frontend
```

### Database Only

```bash
# Start PostgreSQL
docker-compose up postgres -d

# Connect to database
docker exec -it adryx-postgres psql -U adryx -d adryx
```

## Environment Variables

### Backend

Create `apps/backend/.env` file:

```env
NODE_ENV=production
PORT=3000
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_NAME=adryx
DATABASE_USER=adryx
DATABASE_PASSWORD=adryx_password
```

### Frontend

Create `apps/frontend/.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Docker Compose Commands

```bash
# Build images
docker-compose build

# Build without cache
docker-compose build --no-cache

# Start services
docker-compose up -d

# View logs
docker-compose logs -f [service_name]

# Restart a service
docker-compose restart [service_name]

# Stop services
docker-compose stop

# Remove containers
docker-compose down

# Remove containers and volumes
docker-compose down -v

# View running containers
docker-compose ps

# Execute command in container
docker-compose exec backend sh
docker-compose exec frontend sh
docker-compose exec postgres psql -U adryx
```

## Troubleshooting

### Port Already in Use

If ports 3000, 3001, or 5432 are already in use, modify the port mappings in `docker-compose.yml`:

```yaml
services:
  frontend:
    ports:
      - "3002:3000"  # Change host port
  backend:
    ports:
      - "3003:3000"  # Change host port
  postgres:
    ports:
      - "5433:5432"  # Change host port
```

### Database Connection Issues

Ensure the database is healthy before starting other services:

```bash
# Check database health
docker-compose ps

# View database logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

### Frontend Build Issues

If the frontend build fails, ensure `next.config.ts` has `output: 'standalone'`:

```typescript
const nextConfig: NextConfig = {
  output: 'standalone',
};
```

### Clear Everything and Start Fresh

```bash
# Stop and remove all containers, networks, and volumes
docker-compose down -v

# Remove all images
docker-compose down --rmi all

# Rebuild and start
docker-compose up -d --build
```

## Production Deployment

For production deployment, consider:

1. **Use environment-specific compose files**:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

2. **Set secure passwords** in environment variables

3. **Use secrets management** for sensitive data

4. **Configure reverse proxy** (nginx, traefik) for SSL/TLS

5. **Set up monitoring** and logging

6. **Configure backups** for PostgreSQL data

## Health Checks

All services include health checks:

```bash
# Check service health
docker-compose ps

# View health check logs
docker inspect --format='{{json .State.Health}}' adryx-backend
```

## Volumes

Data is persisted in Docker volumes:

- `postgres_data`: PostgreSQL database data

To backup the database:

```bash
# Backup
docker exec adryx-postgres pg_dump -U adryx adryx > backup.sql

# Restore
docker exec -i adryx-postgres psql -U adryx adryx < backup.sql
```

## Network

All services run on the `adryx-network` Docker network, allowing them to communicate using service names as hostnames.

## Next Steps

- Configure environment variables for your deployment
- Set up CI/CD pipeline for automated builds
- Configure monitoring and logging
- Set up database migrations
- Configure SSL/TLS certificates
