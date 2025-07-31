#!/bin/bash

# RAG Document Assistant - Startup Script
echo "🚀 RAG Document Assistant"
echo "========================="

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Please copy .env.example to .env and configure your settings:"
    echo "  cp .env.example .env"
    echo "  # Edit .env with your OpenAI API key and other settings"
    exit 1
fi

# Parse command line arguments
MODE="production"
if [ "$1" = "dev" ] || [ "$1" = "development" ]; then
    MODE="development"
fi

if [ "$MODE" = "development" ]; then
    echo "🛠️  Starting in DEVELOPMENT mode (with hot reloading)..."
    echo "Frontend will reload automatically when you make changes."
    docker-compose -f docker-compose.dev.yml up -d
else
    echo "🚀 Starting in PRODUCTION mode (optimized builds)..."
    docker-compose up -d
fi

echo ""
echo "⏳ Waiting for services to start..."
sleep 10

echo ""
echo "🌐 Application URLs:"
echo "  📱 Frontend:    http://localhost"
echo "  🔧 n8n:         http://localhost/n8n"
echo "  🗄️  Qdrant:      http://localhost:6333"
echo "  🗃️  PgAdmin:     http://localhost/pgadmin"
echo ""
echo "📋 Next Steps:"
echo "1. Configure n8n workflows at http://localhost:5678"
echo "2. Add your OpenAI API key to n8n credentials"
echo "3. Activate the RAG workflows"
echo "4. Start using the app at http://localhost:3000"
echo ""
echo "📖 For detailed setup instructions, see README.md"
echo ""
echo "To stop the application:"
if [ "$MODE" = "development" ]; then
    echo "  docker-compose -f docker-compose.dev.yml down"
else
    echo "  docker-compose down"
fi 