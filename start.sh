#!/bin/bash

# PPTX Generator API - Start Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}PPTX Generator API${NC}"
echo "================================"

# Check for API key
if [ -z "$ANTHROPIC_API_KEY" ]; then
    if [ -f ".env" ]; then
        export $(grep -v '^#' .env | xargs)
    fi

    if [ -z "$ANTHROPIC_API_KEY" ]; then
        echo -e "${RED}Error: ANTHROPIC_API_KEY is not set${NC}"
        echo ""
        echo "Set it using one of these methods:"
        echo "  1. export ANTHROPIC_API_KEY=sk-ant-..."
        echo "  2. Create a .env file with ANTHROPIC_API_KEY=sk-ant-..."
        exit 1
    fi
fi

echo -e "${GREEN}✓${NC} API key found"

# Parse arguments
MODE="${1:-local}"

case "$MODE" in
    local)
        echo -e "${YELLOW}Starting in local mode...${NC}"
        echo ""

        # Check if node is installed
        if ! command -v node &> /dev/null; then
            echo -e "${RED}Error: Node.js is not installed${NC}"
            exit 1
        fi

        cd api

        # Install dependencies if needed
        if [ ! -d "node_modules" ]; then
            echo "Installing dependencies..."
            npm install
        fi

        echo ""
        echo -e "${GREEN}Starting server on http://localhost:3000${NC}"
        echo "Press Ctrl+C to stop"
        echo ""

        node src/index.js
        ;;

    docker)
        echo -e "${YELLOW}Starting in Docker mode...${NC}"
        echo ""

        # Check if docker is installed
        if ! command -v docker &> /dev/null; then
            echo -e "${RED}Error: Docker is not installed${NC}"
            exit 1
        fi

        echo "Building and starting container..."
        docker-compose up --build
        ;;

    docker-detached)
        echo -e "${YELLOW}Starting in Docker mode (detached)...${NC}"
        echo ""

        if ! command -v docker &> /dev/null; then
            echo -e "${RED}Error: Docker is not installed${NC}"
            exit 1
        fi

        docker-compose up --build -d
        echo ""
        echo -e "${GREEN}✓${NC} Container started"
        echo ""
        echo "View logs:  docker-compose logs -f"
        echo "Stop:       docker-compose down"
        echo ""
        echo -e "${GREEN}API running at http://localhost:3000${NC}"
        ;;

    stop)
        echo "Stopping Docker containers..."
        docker-compose down
        echo -e "${GREEN}✓${NC} Stopped"
        ;;

    *)
        echo "Usage: ./start.sh [mode]"
        echo ""
        echo "Modes:"
        echo "  local            Run locally with Node.js (default)"
        echo "  docker           Run in Docker (foreground)"
        echo "  docker-detached  Run in Docker (background)"
        echo "  stop             Stop Docker containers"
        echo ""
        echo "Environment:"
        echo "  ANTHROPIC_API_KEY  Required - your Claude API key"
        echo ""
        echo "Examples:"
        echo "  ./start.sh"
        echo "  ./start.sh docker"
        echo "  ANTHROPIC_API_KEY=sk-ant-... ./start.sh"
        exit 1
        ;;
esac
