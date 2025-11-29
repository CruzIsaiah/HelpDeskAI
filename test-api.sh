#!/bin/bash

API_URL="${1:-http://localhost:8000}"

echo "Testing API endpoints at: $API_URL"

# Test health check
echo "  → Testing GET /health"
curl -s "$API_URL/health" | grep -q "healthy" && echo "    ✓ Health check passed" || echo "    ✗ Health check failed"

# Test root endpoint
echo "  → Testing GET /"
curl -s "$API_URL/" | grep -q "running" && echo "    ✓ Root endpoint passed" || echo "    ✗ Root endpoint failed"

echo "API tests complete"
