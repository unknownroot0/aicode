#!/bin/bash

# Diceymio Project Setup Script
# This script sets up the project with all necessary configurations

set -e

echo "🚀 Setting up Diceymio..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Node.js is not installed. Please install Node.js 18+${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js found: $(node --version)${NC}"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}PostgreSQL is not found. Make sure it's running and accessible.${NC}"
fi

# Install dependencies
echo -e "${GREEN}Installing dependencies...${NC}"
yarn install

# Setup API environment
echo -e "${GREEN}Setting up API environment...${NC}"
if [ ! -f "apps/api/.env" ]; then
    cp apps/api/.env.example apps/api/.env
    echo -e "${YELLOW}Created apps/api/.env. Please update DATABASE_URL and other credentials.${NC}"
fi

# Setup Web environment
echo -e "${GREEN}Setting up Web environment...${NC}"
if [ ! -f "apps/web/.env.local" ]; then
    cp apps/web/.env.example apps/web/.env.local
    echo -e "${YELLOW}Created apps/web/.env.local${NC}"
fi

# Run Prisma migrations
echo -e "${GREEN}Setting up database...${NC}"
yarn prisma:generate
yarn prisma:migrate

# Seed database
echo -e "${GREEN}Seeding database...${NC}"
yarn prisma:seed

echo -e "${GREEN}✓ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Update apps/api/.env with your actual DATABASE_URL and other credentials"
echo "2. Run: yarn dev"
echo ""
echo "Development servers will start on:"
echo "  - API: http://localhost:3000"
echo "  - Web: http://localhost:3001"
