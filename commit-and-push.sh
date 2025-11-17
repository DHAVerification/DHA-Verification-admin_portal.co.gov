#!/bin/bash
set -e
cd /workspaces/Inshallah786

echo "📊 Git Status:"
git status

echo ""
echo "🔄 Adding changes..."
git add -A

echo ""
echo "📝 Committing..."
git commit -m "🔧 CRITICAL FIX: Remove render.yaml buildFilter & add fallback path resolution" || echo "Already up to date"

echo ""
echo "🚀 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Push complete - Render redeployment triggered!"
