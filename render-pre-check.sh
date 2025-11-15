#!/bin/bash

echo "================================================"
echo "🔍 RENDER DEPLOYMENT PRE-CHECK"
echo "================================================"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter
CHECKS_PASSED=0
CHECKS_FAILED=0

# Function to check file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $2"
        ((CHECKS_PASSED++))
    else
        echo -e "${RED}❌${NC} $2 - File not found: $1"
        ((CHECKS_FAILED++))
    fi
}

# Function to check content
check_content() {
    if grep -q "$2" "$1" 2>/dev/null; then
        echo -e "${GREEN}✅${NC} $3"
        ((CHECKS_PASSED++))
    else
        echo -e "${RED}❌${NC} $3"
        ((CHECKS_FAILED++))
    fi
}

echo "📋 Checking Critical Files..."
check_file "package.json" "package.json exists"
check_file "server/index.js" "server/index.js exists"
check_file "server/config/secrets.js" "server/config/secrets.js exists"
check_file "server/services/permit-service.js" "permit-service.js exists"
check_file "server/services/pdf-generator.js" "pdf-generator.js exists"
check_file "server/services/document-verification.js" "document-verification.js exists"
check_file "server/routes/permits.js" "routes/permits.js exists"
check_file "render.yaml" "render.yaml blueprint exists"
check_file "Dockerfile" "Dockerfile exists"
check_file ".dockerignore" ".dockerignore exists"

echo ""
echo "📦 Checking package.json Configuration..."
check_content "package.json" '"type": "module"' "ES6 modules enabled"
check_content "package.json" '"node": ">=20"' "Node 20+ requirement set"
check_content "package.json" '"start": "NODE_ENV=production node server/index.js"' "Start script configured"
check_content "package.json" '"express"' "Express dependency present"
check_content "package.json" '"pdfkit"' "PDFKit dependency present"
check_content "package.json" '"qrcode"' "QRCode dependency present"

echo ""
echo "🔧 Checking Server Configuration..."
check_content "server/config/secrets.js" "process.env.PORT || 3000" "PORT defaults to 3000"
check_content "server/config/secrets.js" "NODE_ENV" "NODE_ENV checking"
check_content "server/index.js" "app.listen" "Server listen implemented"
check_content "server/index.js" "/api/health" "Health check endpoint"
check_content "server/index.js" "helmet" "Helmet security"
check_content "server/index.js" "cors" "CORS middleware"

echo ""
echo "📄 Checking Document System..."
check_content "server/services/permit-service.js" "getAllPermits" "Permit retrieval function"
check_content "server/services/pdf-generator.js" "generatePermitPDF" "PDF generation function"
check_content "server/services/document-verification.js" "generateDocumentHash" "Verification function"
check_content "server/routes/permits.js" "app.get.*permits" "Permit routes"
check_content "server/routes/permits.js" "api/health" "Health check route"

echo ""
echo "🚀 Checking Docker Configuration..."
check_file "Dockerfile" "Dockerfile exists for containerization"
check_content "Dockerfile" "FROM node:20-alpine" "Node 20 Alpine base image"
check_content "Dockerfile" "HEALTHCHECK" "Health check in Docker"
check_content "Dockerfile" "USER nodejs" "Non-root user security"
check_content ".dockerignore" "node_modules" ".dockerignore excludes node_modules"

echo ""
echo "📋 Checking Render Blueprint..."
check_content "render.yaml" "type: web" "Web service type"
check_content "render.yaml" "env: node" "Node environment"
check_content "render.yaml" "healthCheckPath: /api/health" "Health check configured"
check_content "render.yaml" "autoDeploy: true" "Auto-deploy enabled"

echo ""
echo "📁 Checking Assets..."
if [ -d "attached_assets" ]; then
    echo -e "${GREEN}✅${NC} attached_assets directory exists"
    ((CHECKS_PASSED++))
    
    # Count images
    IMG_COUNT=$(find attached_assets/images -type f 2>/dev/null | wc -l)
    if [ "$IMG_COUNT" -gt 0 ]; then
        echo -e "${GREEN}✅${NC} Found $IMG_COUNT template images"
        ((CHECKS_PASSED++))
    else
        echo -e "${YELLOW}⚠️ ${NC} No images found in attached_assets/images"
    fi
else
    echo -e "${RED}❌${NC} attached_assets directory not found"
    ((CHECKS_FAILED++))
fi

echo ""
echo "📊 Checking Data Files..."
check_content "server/services/permit-service.js" "getFallbackPermits" "Fallback data system"
check_content "server/services/permit-service.js" "Muhammad Mohsin" "Permit records present"

echo ""
echo "================================================"
echo "📊 CHECK SUMMARY"
echo "================================================"
echo -e "✅ Passed: ${GREEN}$CHECKS_PASSED${NC}"
echo -e "❌ Failed: ${RED}$CHECKS_FAILED${NC}"
echo "================================================"

if [ $CHECKS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ ALL CHECKS PASSED - READY FOR RENDER DEPLOYMENT!${NC}"
    echo ""
    echo "Next Steps:"
    echo "1. git add ."
    echo "2. git commit -m 'Render production deployment'"
    echo "3. git push origin main"
    echo "4. Go to https://dashboard.render.com"
    echo "5. Create new Web Service"
    echo "6. Set environment variables"
    echo "7. Deploy!"
    echo ""
    exit 0
else
    echo -e "${RED}❌ SOME CHECKS FAILED - REVIEW AND FIX BEFORE DEPLOYMENT${NC}"
    echo ""
    exit 1
fi
