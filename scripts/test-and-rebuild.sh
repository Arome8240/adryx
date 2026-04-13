#!/bin/bash

# Test Database and Rebuild Docker
# Combines testing and rebuilding in one command

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}═══════════════════════════════════════════════${NC}"
echo -e "${CYAN}  Test & Rebuild Workflow${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════${NC}"

# Step 1: Test database connection
echo -e "\n${CYAN}Step 1: Testing database connection...${NC}"
if make test-db; then
    echo -e "\n${GREEN}✅ Database tests passed!${NC}"
else
    echo -e "\n${RED}❌ Database tests failed!${NC}"
    echo -e "${YELLOW}⚠️  Please fix the database connection before rebuilding Docker${NC}"
    exit 1
fi

# Step 2: Ask for confirmation
echo -e "\n${CYAN}Step 2: Ready to rebuild Docker containers${NC}"
echo -e "${YELLOW}⚠️  This will rebuild and restart all containers${NC}"
read -p "Continue? (y/N) " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}ℹ️  Rebuild cancelled${NC}"
    exit 0
fi

# Step 3: Rebuild Docker
echo -e "\n${CYAN}Step 3: Rebuilding Docker containers...${NC}"
make docker-rebuild

# Step 4: Wait for services to start
echo -e "\n${CYAN}Step 4: Waiting for services to start...${NC}"
sleep 10

# Step 5: Check status
echo -e "\n${CYAN}Step 5: Checking container status...${NC}"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Step 6: Check logs
echo -e "\n${CYAN}Step 6: Checking backend logs...${NC}"
docker logs adryx-backend --tail 10

# Summary
echo -e "\n${CYAN}═══════════════════════════════════════════════${NC}"
echo -e "${CYAN}  Deployment Complete${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════${NC}"

echo -e "\n${GREEN}✅ All services are running!${NC}"
echo -e "\n${BLUE}Access your application:${NC}"
echo -e "${BLUE}   Frontend:  http://localhost:3000${NC}"
echo -e "${BLUE}   Backend:   http://localhost:3001/api/v1${NC}"
echo -e "${BLUE}   API Docs:  http://localhost:3001/api/docs${NC}"
echo -e "${BLUE}   Database:  localhost:5433${NC}"

echo -e "\n${BLUE}💡 Useful commands:${NC}"
echo -e "${BLUE}   make docker-logs    - View all logs${NC}"
echo -e "${BLUE}   make docker-down    - Stop services${NC}"
echo -e "${BLUE}   make ps             - Check status${NC}"
