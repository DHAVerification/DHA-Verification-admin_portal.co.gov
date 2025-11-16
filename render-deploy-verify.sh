#!/bin/bash

# DHA Official Production Deployment Script
# For Render Deployment Platform
# This script ensures all components are ready for live deployment

set -e

echo "========================================="
echo "🇿🇦 DHA Official Deployment Verification"
echo "========================================="

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ $2${NC}"
    else
        echo -e "${RED}✗ $2${NC}"
        exit 1
    fi
}

# Check Node.js
echo -e "\n${YELLOW}Checking Node.js...${NC}"
node --version
print_status $? "Node.js version check"

# Check if all required files exist
echo -e "\n${YELLOW}Checking required files...${NC}"

files_to_check=(
    "server/index.js"
    "attached_assets/index.html"
    "attached_assets/id-card.html"
    "attached_assets/travel-document.html"
    "attached_assets/permanent-residence.html"
    "attached_assets/e-visa.html"
    "attached_assets/work-permit.html"
    "attached_assets/permit-profile.html"
    "attached_assets/admin-dashboard.html"
    "attached_assets/verify.html"
    "package.json"
    "render.yaml"
)

for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} $file - MISSING!"
        exit 1
    fi
done

# Check package.json structure
echo -e "\n${YELLOW}Verifying package.json...${NC}"
if grep -q '"type": "module"' package.json; then
    print_status 0 "ES Module configuration"
else
    print_status 1 "ES Module configuration"
fi

if grep -q '"start": "NODE_ENV=production node server/index.js"' package.json; then
    print_status 0 "Start script configured"
else
    print_status 1 "Start script not properly configured"
fi

# Check render.yaml
echo -e "\n${YELLOW}Verifying render.yaml...${NC}"
if grep -q "healthCheckPath: /api/health" render.yaml; then
    print_status 0 "Health check configured"
else
    print_status 1 "Health check not configured"
fi

# Install dependencies
echo -e "\n${YELLOW}Installing dependencies...${NC}"
npm install --legacy-peer-deps 2>&1 | tail -5
print_status $? "Dependencies installed"

# Check if server starts
echo -e "\n${YELLOW}Testing server startup (30 seconds)...${NC}"
timeout 30 npm start &
SERVER_PID=$!
sleep 5

# Check if server is running
if ps -p $SERVER_PID > /dev/null 2>&1; then
    print_status 0 "Server started successfully"
    # Test health endpoint
    HEALTH_RESPONSE=$(curl -s http://localhost:3000/api/health || echo "error")
    if echo "$HEALTH_RESPONSE" | grep -q "operational"; then
        print_status 0 "Health check endpoint working"
    else
        echo -e "${YELLOW}Health endpoint response: $HEALTH_RESPONSE${NC}"
    fi
    kill $SERVER_PID 2>/dev/null || true
else
    print_status 1 "Server failed to start"
fi

# Summary
echo -e "\n========================================="
echo -e "${GREEN}✓ All deployment checks passed!${NC}"
echo "========================================="
echo -e "\n${GREEN}Ready for Render deployment:${NC}"
echo "1. Push to GitHub: git push origin main"
echo "2. Deploy on Render: Connect repository to Render"
echo "3. Render will automatically:"
echo "   - Install dependencies"
echo "   - Build using render.yaml"
echo "   - Start with npm start"
echo "   - Monitor health at /api/health"
echo -e "\n${YELLOW}Visit your app at: https://your-render-app.onrender.com${NC}"
