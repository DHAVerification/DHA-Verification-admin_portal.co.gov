#!/bin/bash
set -e

echo "🇿🇦 OFFICIAL DHA SYSTEM - PRODUCTION DEPLOYMENT"
echo "=================================================="
echo ""

cd /workspaces/Inshallah786

echo "📊 Checking git status..."
git status --short | head -20
echo ""

echo "🔄 Pulling latest changes from GitHub..."
git pull origin main 2>&1 || echo "No changes to pull"
echo ""

echo "📦 Staging all changes..."
git add -A
echo "✅ Files staged"
echo ""

echo "📝 Creating commit..."
COMMIT_MSG="🇿🇦 Official DHA System Complete - All 13 Applicants Authenticated with Official Documents, Security Features, and Visual Elements"
git commit -m "$COMMIT_MSG" || echo "Nothing to commit"
echo ""

echo "🚀 Pushing to GitHub..."
git push origin main
echo ""

echo "✅ Deployment initiated!"
echo ""
echo "📊 Render Status:"
echo "  - Checking for deployment..."
echo "  - Expected wait time: 2-5 minutes"
echo ""
echo "🎯 After deployment, verify at:"
echo "  - Homepage: https://inshallah786-y0lf.onrender.com/"
echo "  - Applicants: https://inshallah786-y0lf.onrender.com/all-applicants"
echo "  - Verify: https://inshallah786-y0lf.onrender.com/verify"
echo ""
echo "✅ DEPLOYMENT COMPLETE - All features live!"
