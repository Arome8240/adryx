#!/bin/bash

API_URL="http://localhost:3001/api/v1"

echo "=== Testing Adryx Auth Endpoints ==="
echo ""

# Test 1: Register an advertiser
echo "1. Testing Registration (Advertiser)..."
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "advertiser@test.com",
    "password": "password123",
    "name": "Test Advertiser",
    "role": "advertiser"
  }')

echo "$REGISTER_RESPONSE" | jq '.'
TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.accessToken')
echo "Token: ${TOKEN:0:50}..."
echo ""

# Test 2: Login with email
echo "2. Testing Email Login..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "advertiser@test.com",
    "password": "password123"
  }')

echo "$LOGIN_RESPONSE" | jq '.'
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.accessToken')
echo ""

# Test 3: Get profile
echo "3. Testing Get Profile..."
PROFILE_RESPONSE=$(curl -s -X GET "$API_URL/auth/me" \
  -H "Authorization: Bearer $TOKEN")

echo "$PROFILE_RESPONSE" | jq '.'
echo ""

# Test 4: Register a publisher
echo "4. Testing Registration (Publisher)..."
PUBLISHER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "publisher@test.com",
    "password": "password123",
    "name": "Test Publisher",
    "role": "publisher"
  }')

echo "$PUBLISHER_RESPONSE" | jq '.'
echo ""

# Test 5: Health check
echo "5. Testing Health Endpoint..."
HEALTH_RESPONSE=$(curl -s -X GET "$API_URL/health")
echo "$HEALTH_RESPONSE" | jq '.'
echo ""

echo "=== Auth Tests Complete ==="
