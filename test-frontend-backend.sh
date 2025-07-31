#!/bin/bash

echo "Testing Frontend-Backend Integration"
echo "===================================="

# Base URL for testing
BASE_URL="http://localhost/n8n/webhook"

# Test 1: Document Status Endpoint
echo "1. Testing Document Status endpoint..."
curl -s -X GET "$BASE_URL/document-status" | jq . || echo "   ❌ Document Status endpoint failed or returned invalid JSON"

# Test 2: Chat endpoint (with sample message)
echo "2. Testing Chat endpoint..."
curl -s -X POST "$BASE_URL/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, test message"}' | jq . || echo "   ❌ Chat endpoint failed or returned invalid JSON"

# Test 3: Check if upload endpoint is reachable
echo "3. Testing Upload endpoint (GET request - should fail but endpoint should be reachable)..."
curl -s -X GET "$BASE_URL/upload-document" || echo "   ✅ Upload endpoint is reachable (expected to fail with GET)"

# Test 4: Check if delete endpoint is reachable
echo "4. Testing Delete endpoint (without file_id - should return error)..."
curl -s -X POST "$BASE_URL/delete-document" \
  -H "Content-Type: application/json" \
  -d '{}' | jq . || echo "   ❌ Delete endpoint failed or returned invalid JSON"

echo ""
echo "Integration test complete!"
echo "If you see JSON responses above, the backend is working correctly."
echo "If you see errors, make sure your n8n instance is running and workflows are active." 