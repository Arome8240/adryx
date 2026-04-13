#!/bin/bash

# Environment Setup Script
# Creates .env file if it doesn't exist

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}═══════════════════════════════════════════════${NC}"
echo -e "${CYAN}  Environment Setup${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════${NC}"

ENV_FILE="apps/backend/.env"
EXAMPLE_FILE="apps/backend/.env.example"

if [ -f "$ENV_FILE" ]; then
    echo -e "\n${GREEN}✅ .env file already exists${NC}"
    echo -e "${BLUE}💡 To reconfigure, delete it first: rm $ENV_FILE${NC}"
    exit 0
fi

if [ ! -f "$EXAMPLE_FILE" ]; then
    echo -e "\n${YELLOW}⚠️  .env.example not found${NC}"
    exit 1
fi

echo -e "\n${CYAN}📝 Creating .env file from .env.example...${NC}"
cp "$EXAMPLE_FILE" "$ENV_FILE"
echo -e "${GREEN}✅ Created $ENV_FILE${NC}"

echo -e "\n${YELLOW}⚠️  IMPORTANT: Update the following in $ENV_FILE:${NC}"
echo -e "${BLUE}   1. DB_HOST - Your PostgreSQL host${NC}"
echo -e "${BLUE}   2. DB_PORT - Your PostgreSQL port${NC}"
echo -e "${BLUE}   3. DB_USERNAME - Your PostgreSQL username${NC}"
echo -e "${BLUE}   4. DB_PASSWORD - Your PostgreSQL password${NC}"
echo -e "${BLUE}   5. DB_DATABASE - Your database name${NC}"
echo -e "${BLUE}   6. JWT_SECRET - Change to a secure random string${NC}"

echo -e "\n${CYAN}💡 Quick edit:${NC}"
echo -e "${BLUE}   nano $ENV_FILE${NC}"
echo -e "${BLUE}   # or${NC}"
echo -e "${BLUE}   vim $ENV_FILE${NC}"

echo -e "\n${CYAN}💡 After updating, test the connection:${NC}"
echo -e "${BLUE}   make test-db${NC}"
