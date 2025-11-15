#!/bin/bash

# DHA Back Office - Quick Start Script
# Version 2.0.0 - Production Ready

echo "🏛️  DHA BACK OFFICE - QUICK START SETUP"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "📥 Install Node.js 20+ from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js: $(node --version)"
echo "✅ npm: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install --silent

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Check for .env file
if [ ! -f .env ]; then
    echo "⚠️  No .env file found"
    echo "📋 Creating from template..."
    cp .env.production .env
    echo "✅ .env created (configure with your API keys)"
fi

echo ""
echo "🚀 Starting DHA Back Office Server..."
echo "🌐 Access at: http://localhost:5000"
echo ""
echo "📋 Available Commands:"
echo "   GET  /api/health              - Server health check"
echo "   GET  /api/permits             - List all permits"
echo "   GET  /api/permits/:id         - Get specific permit"
echo "   GET  /api/permits/:id/pdf     - Generate PDF"
echo "   GET  /api/permits/:id/qr      - Generate QR code"
echo "   GET  /api/permits/:id/verify-document - Verify document"
echo ""
echo "📊 Test Suite:"
echo "   node test-production-system.js - Run validation suite"
echo ""
echo "🛑 Press Ctrl+C to stop server"
echo ""

# Start the server
npm start
