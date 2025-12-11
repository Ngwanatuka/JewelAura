#!/bin/bash

set -e

echo "🚀 Starting JewelAura deployment..."

# Check if environment is provided
if [ -z "$1" ]; then
    echo "Usage: ./deploy.sh [dev|prod]"
    exit 1
fi

ENV=$1

case $ENV in
    "dev")
        echo "📦 Deploying to development environment..."
        docker compose down
        docker compose up --build -d
        echo "✅ Development deployment complete!"
        echo "🌐 Frontend: http://localhost:3000"
        echo "🔧 Backend: http://localhost:5000"
        echo "🗄️ MongoDB: mongodb://localhost:27017"
        ;;
    "prod")
        echo "🏭 Deploying to production environment..."
        
        # Load environment variables from .env file
        if [ -f ".env" ]; then
            export $(cat .env | grep -v '^#' | xargs)
        fi
        
        # Check if required environment variables are set
        if [ -z "$MONGO_URL" ] || [ -z "$JWT_SECRET" ] || [ -z "$STRIPE_SECRET_KEY" ]; then
            echo "❌ Missing required environment variables:"
            echo "   - MONGO_URL"
            echo "   - JWT_SECRET"
            echo "   - STRIPE_SECRET_KEY"
            exit 1
        fi
        
        docker compose -f docker-compose.prod.yml down
        docker compose -f docker-compose.prod.yml pull
        docker compose -f docker-compose.prod.yml up -d
        echo "✅ Production deployment complete!"
        echo "🌐 Application: http://localhost"
        ;;
    *)
        echo "❌ Invalid environment. Use 'dev' or 'prod'"
        exit 1
        ;;
esac

echo "🎉 Deployment finished!"