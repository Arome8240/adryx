.PHONY: help docker-up docker-down docker-logs docker-clean dev-up dev-down install build test

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
	@echo ""
	@echo "Individual Services:"
	@echo "  make frontend       - Start frontend dev server"
	@echo "  make backend        - Start backend dev server"
	@echo "  make db             - Start database only"
	@echo ""

# Docker commands
docker-up:
	@echo "🚀 Starting Adryx with Docker..."
	docker-compose up -d
	@echo "✅ Services started!"
	@echo "   Frontend: http://localhost:3000"
	@echo "   Backend:  http://localhost:3001"
	@echo "   API Docs: http://localhost:3001/api/docs"

docker-down:
	@echo "🛑 Stopping Docker services..."
	docker-compose down

docker-logs:
	docker-compose logs -f

docker-clean:
	@echo "🧹 Cleaning up Docker..."
	docker-compose down -v --rmi local
	@echo "✅ Cleanup complete"

docker-rebuild:
	@echo "🔨 Rebuilding Docker services..."
	docker-compose up -d --build

# Development commands
dev-up:
	@echo "🔧 Starting development environment..."
	docker-compose -f docker-compose.dev.yml up -d
	@echo "✅ Development environment started!"
	@echo "   Backend:  http://localhost:3001"
	@echo "   Database: localhost:5432"
	@echo ""
	@echo "💡 Start frontend manually:"
	@echo "   cd apps/frontend && pnpm dev"

dev-down:
	docker-compose -f docker-compose.dev.yml down

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
	docker-compose up postgres -d
	@echo "✅ Database started on localhost:5432"

# Utility commands
ps:
	docker-compose ps

shell-backend:
	docker-compose exec backend sh

shell-frontend:
	docker-compose exec frontend sh

shell-db:
	docker-compose exec postgres psql -U adryx -d adryx

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
