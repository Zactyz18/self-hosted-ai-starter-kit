#!/bin/bash

# RAG Document Assistant - System Test Script
echo "🚀 RAG Document Assistant - System Test"
echo "========================================"

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose not found. Please install Docker Compose."
    exit 1
fi

echo "✅ Docker Compose found"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "📝 Please edit .env file with your configuration (especially OPENAI_API_KEY)"
        echo "   Then run this script again."
        exit 1
    else
        echo "❌ .env.example file not found. Please create .env manually."
        exit 1
    fi
fi

echo "✅ .env file found"

# Start the application
echo "🐳 Starting Docker containers..."
docker-compose up -d

# Wait a moment for services to start
echo "⏳ Waiting for services to start (30 seconds)..."
sleep 30

# Check if services are running
echo "🔍 Checking service status..."

# Check n8n
if curl -f http://localhost:5678 > /dev/null 2>&1; then
    echo "✅ n8n is running at http://localhost:5678"
else
    echo "❌ n8n is not responding"
fi

# Check Qdrant
if curl -f http://localhost:6333 > /dev/null 2>&1; then
    echo "✅ Qdrant is running at http://localhost:6333"
else
    echo "❌ Qdrant is not responding"
fi

# Check Frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is running at http://localhost:3000"
else
    echo "❌ Frontend is not responding"
fi

echo ""
echo "🎉 System Test Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Open http://localhost:5678 to configure n8n workflows"
echo "2. Add your OpenAI API key to n8n credentials"
echo "3. Activate the RAG workflows"
echo "4. Open http://localhost:3000 to use the application"
echo ""
echo "📖 For detailed setup instructions, see README.md" 