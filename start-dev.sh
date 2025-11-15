#!/bin/bash

echo "🚀 Starting DHA Back Office Server..."

# Force production mode
export NODE_ENV=production
export USE_PRODUCTION_APIS=true
export FORCE_REAL_APIS=true
export VERIFICATION_LEVEL=high
export REAL_TIME_VALIDATION=true

# Start the server
node server/index.js
