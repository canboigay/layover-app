#!/bin/bash

# Update frontend to connect to Render backend
# Usage: ./update-frontend.sh https://your-backend-url.onrender.com

if [ -z "$1" ]; then
  echo "❌ Error: Backend URL required"
  echo "Usage: ./update-frontend.sh https://your-backend-url.onrender.com"
  exit 1
fi

BACKEND_URL=$1

echo "🔧 Updating frontend configuration..."
echo "Backend URL: $BACKEND_URL"

# Create .env file for frontend
cat > frontend/.env << EOF
VITE_API_URL=${BACKEND_URL}/api
VITE_SOCKET_URL=${BACKEND_URL}
EOF

echo "✅ Environment variables set"

# Build frontend
echo "🏗️  Building frontend..."
cd frontend
npm run build

# Deploy to Cloudflare
echo "☁️  Deploying to Cloudflare Pages..."
npx wrangler pages deploy dist --project-name=layover-app --commit-dirty=true

echo ""
echo "✨ Deployment complete!"
echo "🌐 Your app is live at: https://e976da6e.layover-app.pages.dev"
echo ""
