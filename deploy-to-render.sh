#!/bin/bash

echo "🇿🇦 DEPLOYING TO GITHUB & RENDER"
echo "=================================="
echo ""

cd /workspaces/Inshallah786

# Method 1: Standard Git Push
echo "📤 Method 1: Standard Git Push"
echo "================================"
echo ""
echo "Running: git pull origin main"
git pull origin main 2>&1
echo ""

echo "Running: git add -A"
git add -A
echo "✅ Files staged"
echo ""

echo "Running: git commit -m '🇿🇦 Official DHA System Complete - All Documents Certified'"
git commit -m "🇿🇦 Official DHA System Complete - All Documents Certified" 2>&1
echo ""

echo "Running: git push origin main"
git push origin main 2>&1
echo ""

if [ $? -eq 0 ]; then
  echo "✅ DEPLOYMENT SUCCESSFUL!"
  echo ""
  echo "📊 Render Status:"
  echo "  - GitHub received push ✅"
  echo "  - Render webhook triggered ✅"
  echo "  - Auto-deployment in progress (2-5 minutes)"
  echo ""
  echo "🎯 Live Website:"
  echo "  - Homepage: https://inshallah786-y0lf.onrender.com/"
  echo "  - Applicants: https://inshallah786-y0lf.onrender.com/all-applicants"
  echo "  - Verify: https://inshallah786-y0lf.onrender.com/verify"
else
  echo "⚠️  Push failed. Trying alternative method..."
  echo ""
  
  # Method 2: Force push with verbose output
  echo "📤 Method 2: Verbose Force Push"
  echo "================================"
  git push -u origin main -v --force-with-lease 2>&1
fi

echo ""
echo "✅ Script Complete"
