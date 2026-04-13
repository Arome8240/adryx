#!/bin/bash

# Adryx Docker Start Script
# This script helps you quickly start the Adryx application using Docker

set -e

echo "🚀 Starting Adryx with Docker..."
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "   Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

# Function to use docker compose (v2) or docker-compose (v1)
docker_compose() {
    if docker compose version &> /dev/null 2>&1; then
        docker compose "$@"
    else
        docker-compose "$@"
    fi
}

# Parse arguments
MODE=${1:-production}

case $MODE in
    production|prod)
        echo "📦 Starting in PRODUCTION mode..."
        docker_compose up -d --build
        ;;
    development|dev)
        echo "🔧 Starting in DEVELOPMENT mode..."
        docker_compose -f docker-compose.dev.yml up -d --build
        ;;
    stop)
        echo "🛑 Stopping all services..."
        docker_compose down
        docker_compose -f docker-compose.dev.yml down
        echo "✅ All services stopped"
        exit 0
        ;;
    clean)
        echo "🧹 Cleaning up (removing volumes)..."
        docker_compose down -v
        docker_compose -f docker-compose.dev.yml down -v
        echo "✅ Cleanup complete"
        exit 0
        ;;
    logs)
        echo "📋 Showing logs..."
        docker_compose logs -f
        exit 0
        ;;
    *)
        echo "❌ Invalid mode: $MODE"
        echo ""
        echo "Usage: $0 [mode]"
        echo ""
        echo "Modes:"
        echo "  production, prod  - Start in production mode (default)"
        echo "  development, dev  - Start in development mode"
        echo "  stop              - Stop all services"
        echo "  clean             - Stop and remove all data"
        echo "  logs              - Show logs"
        exit 1
        ;;
esac

# Wait for services to be healthy
echo ""
echo "⏳ Waiting for services to be ready..."
sleep 5

# Check service status
echo ""
echo "📊 Service Status:"
docker_compose ps

echo ""
echo "✅ Adryx is running!"
echo ""
echo "🌐 Access the application:"
echo "   Frontend:  http://localhost:3000"
echo "   Backend:   http://localhost:3001"
echo "   Database:  localhost:5432"
echo ""
echo "📋 Useful commands:"
echo "   View logs:        docker-compose logs -f"
echo "   Stop services:    $0 stop"
echo "   Clean everything: $0 clean"
echo ""
