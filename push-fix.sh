#!/bin/bash
cd /workspaces/Inshallah786
echo "🔄 Pulling latest changes..."
git pull origin main --rebase
echo "✅ Pull complete"
echo "🚀 Pushing to GitHub..."
git push origin main
echo "✅ Push complete - Render deployment triggered!"
