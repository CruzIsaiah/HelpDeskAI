#!/bin/bash

# Test backend API endpoints locally
BACKEND_URL="http://localhost:8000"

echo "Testing API endpoints at $BACKEND_URL"
echo "======================================="
echo ""

echo "1. Testing Health Check"
curl -X GET "$BACKEND_URL/health" -H "Content-Type: application/json"
echo -e "\n"

echo "2. Testing Root Endpoint"
curl -X GET "$BACKEND_URL/" -H "Content-Type: application/json"
echo -e "\n"

echo "3. Listing Available Endpoints"
echo "Backend should expose:"
echo "  - POST /api/transcribe/"
echo "  - POST /api/troubleshoot/"
echo "  - POST /api/manual/generate"
echo "  - POST /api/rag/ingest"
echo "  - GET  /api/rag/search"
echo ""

echo "API Test Complete"
