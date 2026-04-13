#!/bin/bash

# PostgreSQL Connection Test Script
# Simple bash version using psql

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}═══════════════════════════════════════════════${NC}"
echo -e "${CYAN}  PostgreSQL Connection Test (psql)${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════${NC}"

# Check if .env exists
if [ ! -f "apps/backend/.env" ]; then
    echo -e "\n${RED}❌ .env file not found at apps/backend/.env${NC}"
    echo -e "${YELLOW}💡 Please create .env file from .env.example${NC}"
    exit 1
fi

# Load environment variables
echo -e "\n${CYAN}📁 Loading environment variables...${NC}"
export $(grep -v '^#' apps/backend/.env | xargs)

# Set defaults if not provided
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_DATABASE=${DB_DATABASE:-adryx}
DB_USERNAME=${DB_USERNAME:-postgres}

echo -e "${GREEN}✅ Environment variables loaded${NC}"
echo -e "\n${CYAN}📝 Connection Configuration:${NC}"
echo -e "${BLUE}   Host:     ${DB_HOST}${NC}"
echo -e "${BLUE}   Port:     ${DB_PORT}${NC}"
echo -e "${BLUE}   Database: ${DB_DATABASE}${NC}"
echo -e "${BLUE}   User:     ${DB_USERNAME}${NC}"

# Check if psql is installed
if ! command -v psql &> /dev/null; then
    echo -e "\n${YELLOW}⚠️  psql command not found${NC}"
    echo -e "${YELLOW}💡 Using Node.js test script instead...${NC}"
    node scripts/test-db-connection.js
    exit $?
fi

# Test connection
echo -e "\n${CYAN}🔌 Testing PostgreSQL connection...${NC}"

# Build connection string
export PGPASSWORD="${DB_PASSWORD}"

if psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USERNAME}" -d postgres -c "SELECT 1;" &> /dev/null; then
    echo -e "${GREEN}✅ Successfully connected to PostgreSQL!${NC}"
    
    # Get version
    echo -e "\n${CYAN}📊 PostgreSQL Version:${NC}"
    VERSION=$(psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USERNAME}" -d postgres -t -c "SELECT version();")
    echo -e "${GREEN}${VERSION}${NC}"
    
    # Check if database exists
    echo -e "\n${CYAN}🗄️  Checking database...${NC}"
    DB_EXISTS=$(psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USERNAME}" -d postgres -t -c "SELECT 1 FROM pg_database WHERE datname='${DB_DATABASE}';" | xargs)
    
    if [ "$DB_EXISTS" = "1" ]; then
        echo -e "${GREEN}✅ Database '${DB_DATABASE}' exists${NC}"
        
        # List tables
        echo -e "\n${CYAN}📋 Existing tables:${NC}"
        TABLES=$(psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USERNAME}" -d "${DB_DATABASE}" -t -c "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE';")
        
        if [ -z "$TABLES" ]; then
            echo -e "${BLUE}ℹ️  No tables found (will be created by TypeORM)${NC}"
        else
            echo -e "${GREEN}${TABLES}${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  Database '${DB_DATABASE}' does not exist${NC}"
        echo -e "${BLUE}💡 It will be created automatically by TypeORM${NC}"
    fi
    
    # Test Docker PostgreSQL
    echo -e "\n${CYAN}🐳 Testing Docker PostgreSQL (port 5433)...${NC}"
    if PGPASSWORD="adryx_password" psql -h localhost -p 5433 -U adryx -d adryx -c "SELECT 1;" &> /dev/null 2>&1; then
        echo -e "${GREEN}✅ Docker PostgreSQL is running${NC}"
    else
        echo -e "${BLUE}ℹ️  Docker PostgreSQL not running (OK if testing local DB)${NC}"
    fi
    
    # Summary
    echo -e "\n${CYAN}═══════════════════════════════════════════════${NC}"
    echo -e "${CYAN}  Test Summary${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════${NC}"
    echo -e "\n${GREEN}✅ All tests passed!${NC}"
    echo -e "${GREEN}✅ Database connection is working correctly${NC}"
    echo -e "${GREEN}✅ Ready to rebuild Docker containers${NC}"
    echo -e "\n${BLUE}💡 Next steps:${NC}"
    echo -e "${BLUE}   1. Run: make docker-rebuild${NC}"
    echo -e "${BLUE}   2. Or: docker compose up -d --build${NC}"
    
    exit 0
else
    echo -e "\n${RED}❌ Connection failed!${NC}"
    echo -e "\n${YELLOW}💡 Troubleshooting:${NC}"
    echo -e "${YELLOW}   1. Make sure PostgreSQL is running${NC}"
    echo -e "${YELLOW}   2. Check if credentials in .env are correct${NC}"
    echo -e "${YELLOW}   3. Verify host and port settings${NC}"
    echo -e "${YELLOW}   4. Check firewall settings${NC}"
    
    exit 1
fi
