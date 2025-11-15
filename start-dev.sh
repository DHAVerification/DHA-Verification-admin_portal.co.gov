
#!/bin/bash

echo "🚀 Starting backend server on port 8000..."

# Run database seed if needed
if [ ! -f ".db-seeded" ]; then
  echo "📊 Seeding database..."
  npm run db:push
  tsx server/seed.ts
  touch .db-seeded
  echo "✅ Database seeded"
fi

# Start the server
NODE_ENV=production tsx server/index.ts
