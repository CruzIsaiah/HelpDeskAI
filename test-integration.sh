#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
BACKEND_URL="${1:-http://localhost:8000}"
FRONTEND_URL="${2:-http://localhost:3000}"

test_count=0
pass_count=0
fail_count=0

print_test() { echo -e "${BLUE}  ▶${NC} $1"; }
print_pass() { echo -e "${GREEN}    ✓${NC} $1"; ((pass_count++)); }
print_fail() { echo -e "${RED}    ✗${NC} $1"; ((fail_count++)); }

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     Integration Test Suite             ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}\n"

echo -e "${YELLOW}Testing Backend: $BACKEND_URL${NC}"
echo -e "${YELLOW}Testing Frontend: $FRONTEND_URL${NC}\n"

# Test 1: Backend Health Check
echo -e "${BLUE}1. Backend Health Checks${NC}"
((test_count++))
print_test "GET /health endpoint"
response=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/health")
if [ "$response" -eq 200 ]; then
    print_pass "Health check returned 200 OK"
else
    print_fail "Health check failed with status $response"
fi

# Test 2: Root Endpoint
((test_count++))
print_test "GET / endpoint"
response=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/")
if [ "$response" -eq 200 ]; then
    print_pass "Root endpoint returned 200 OK"
else
    print_fail "Root endpoint failed with status $response"
fi

# Test 3: Transcribe Endpoint (should accept POST)
echo -e "\n${BLUE}2. API Endpoint Tests${NC}"
((test_count++))
print_test "POST /api/transcribe/ accessibility"
response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BACKEND_URL/api/transcribe/" \
    -H "Content-Type: multipart/form-data")
if [ "$response" -ne 404 ]; then
    print_pass "Transcribe endpoint is accessible"
else
    print_fail "Transcribe endpoint returned 404"
fi

# Test 4: Troubleshoot Endpoint (should accept POST)
((test_count++))
print_test "POST /api/troubleshoot/ accessibility"
response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BACKEND_URL/api/troubleshoot/" \
    -H "Content-Type: application/json")
if [ "$response" -ne 404 ]; then
    print_pass "Troubleshoot endpoint is accessible"
else
    print_fail "Troubleshoot endpoint returned 404"
fi

# Test 5: Manual Generate Endpoint
((test_count++))
print_test "POST /api/manual/generate accessibility"
response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BACKEND_URL/api/manual/generate" \
    -H "Content-Type: application/json")
if [ "$response" -ne 404 ]; then
    print_pass "Manual generation endpoint is accessible"
else
    print_fail "Manual generation endpoint returned 404"
fi

# Test 6: Frontend Root
echo -e "\n${BLUE}3. Frontend Verification${NC}"
((test_count++))
print_test "Frontend base URL accessibility"
response=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL/")
if [ "$response" -eq 200 ] || [ "$response" -eq 404 ]; then
    print_pass "Frontend is accessible"
else
    print_fail "Frontend returned status $response"
fi

# Test 7: CORS Configuration
echo -e "\n${BLUE}4. CORS Configuration Tests${NC}"
((test_count++))
print_test "CORS headers present"
cors=$(curl -s -i -X OPTIONS "$BACKEND_URL/" 2>/dev/null | grep -i "access-control-allow")
if [ -n "$cors" ]; then
    print_pass "CORS headers are configured"
else
    print_fail "No CORS headers found"
fi

# Summary
echo -e "\n${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║           Test Summary                 ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}\n"

echo -e "Total Tests: ${BLUE}$test_count${NC}"
echo -e "Passed: ${GREEN}$pass_count${NC}"
echo -e "Failed: ${RED}$fail_count${NC}"

if [ $fail_count -eq 0 ]; then
    echo -e "\n${GREEN}✓ All tests passed!${NC}\n"
    exit 0
else
    echo -e "\n${RED}✗ Some tests failed${NC}\n"
    exit 1
fi
