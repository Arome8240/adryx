.PHONY: help docker-up docker-down docker-logs docker-clean dev-up dev-down install build test

# Detect docker compose command (v2 uses 'docker compose', v1 uses 'docker-compose')
DOCKER_COMPOSE := $(shell if docker compose version >/dev/null 2>&1; then echo "docker compose"; else echo "docker-compose"; fi)

# Check if Docker is running
define check_docker
	@docker info >/dev/null 2>&1 || (echo "❌ Docker is not running. Please start Docker Desktop or Docker daemon." && exit 1)
endef

# Default target
help:
	@echo "Adryx - Available Commands"
	@echo ""
	@echo "Docker Commands:"
	@echo "  make docker-up      - Start all services with Docker (production)"
	@echo "  make docker-down    - Stop all Docker services"
	@echo "  make docker-logs    - View Docker logs"
	@echo "  make docker-clean   - Stop and remove all Docker data"
	@echo "  make docker-rebuild - Rebuild and restart Docker services"
	@echo ""
	@echo "Development Commands:"
	@echo "  make dev-up         - Start development environment"
	@echo "  make dev-down       - Stop development environment"
	@echo "  make install        - Install all dependencies"
	@echo "  make build          - Build all packages"
	@echo "  make test           - Run all tests"
	@echo "  make test-db        - Test database connection"
	@echo ""
	@echo "Database Migrations:"
	@echo "  make migration-generate - Generate a new migration"
	@echo "  make migration-run      - Run pending migrations"
	@echo "  make migration-revert   - Revert last migration"
	@echo "  make migration-docker   - Run migrations in Docker"
	@echo ""
	@echo "Individual Services:"
	@echo "  make frontend       - Start frontend dev server"
	@echo "  make backend        - Start backend dev server"
	@echo "  make db             - Start database only"
	@echo ""
	@echo "Using: $(DOCKER_COMPOSE)"
	@echo ""

# Docker commands
docker-up:
	$(check_docker)
	@echo "🚀 Starting Adryx with Docker..."
	$(DOCKER_COMPOSE) up -d
	@echo "✅ Services started!"
	@echo "   Frontend: http://localhost:3000"
	@echo "   Backend:  http://localhost:3001"
	@echo "   API Docs: http://localhost:3001/api/docs"

docker-down:
	$(check_docker)
	@echo "🛑 Stopping Docker services..."
	$(DOCKER_COMPOSE) down

docker-logs:
	$(check_docker)
	$(DOCKER_COMPOSE) logs -f

docker-clean:
	$(check_docker)
	@echo "🧹 Cleaning up Docker..."
	$(DOCKER_COMPOSE) down -v --rmi local
	@echo "✅ Cleanup complete"

docker-rebuild:
	$(check_docker)
	@echo "🔨 Rebuilding Docker services..."
	$(DOCKER_COMPOSE) up -d --build

# Development commands
dev-up:
	$(check_docker)
	@echo "🔧 Starting development environment..."
	$(DOCKER_COMPOSE) -f docker-compose.dev.yml up -d
	@echo "✅ Development environment started!"
	@echo "   Backend:  http://localhost:3001"
	@echo "   Database: localhost:5432"
	@echo ""
	@echo "💡 Start frontend manually:"
	@echo "   cd apps/frontend && pnpm dev"

dev-down:
	$(check_docker)
	$(DOCKER_COMPOSE) -f docker-compose.dev.yml down

install:
	@echo "📦 Installing dependencies..."
	pnpm install

build:
	@echo "🔨 Building all packages..."
	pnpm build

test:
	@echo "🧪 Running tests..."
	pnpm test

# Individual services
frontend:
	@echo "🎨 Starting frontend..."
	pnpm dev:frontend

backend:
	@echo "⚙️  Starting backend..."
	pnpm dev:backend

db:
	@echo "🗄️  Starting database..."
	$(DOCKER_COMPOSE) up postgres -d
	@echo "✅ Database started on localhost:5432"

# Utility commands
ps:
	$(DOCKER_COMPOSE) ps

test-db:
	@echo "🧪 Testing database connection..."
	@(cd apps/backend && node test-db-connection.js)

test-and-rebuild:
	@bash scripts/test-and-rebuild.sh

# Database migrations
migration-generate:
	@echo "📝 Generating migration..."
	@read -p "Migration name: " name; \
	cd apps/backend && pnpm migration:generate src/migrations/$$name

migration-run:
	@echo "🚀 Running migrations..."
	@cd apps/backend && pnpm migration:run

migration-revert:
	@echo "⏪ Reverting last migration..."
	@cd apps/backend && pnpm migration:revert

migration-docker:
	@echo "🐳 Running migrations in Docker..."
	docker exec adryx-backend pnpm migration:run

shell-backend:
	$(DOCKER_COMPOSE) exec backend sh

shell-frontend:
	$(DOCKER_COMPOSE) exec frontend sh

shell-db:
	$(DOCKER_COMPOSE) exec postgres psql -U adryx -d adryx

backup-db:
	@echo "💾 Backing up database..."
	docker exec adryx-postgres pg_dump -U adryx adryx > backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "✅ Backup complete"

restore-db:
	@echo "⚠️  This will restore the database from backup.sql"
	@read -p "Continue? [y/N] " -n 1 -r; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker exec -i adryx-postgres psql -U adryx adryx < backup.sql; \
		echo "✅ Database restored"; \
	fi
