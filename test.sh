#!/bin/bash

# Login
echo "Testing login:"
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"admin@test.com","password":"admin123"}')

# Extract token using grep and sed
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access_token":"[^"]*"' | sed 's/"access_token":"//;s/"//')

# Check if the token was successfully retrieved
if [ -z "$TOKEN" ]; then
  echo "Failed to retrieve token. Check your login credentials."
  exit 1
fi

echo "Token retrieved: $TOKEN"
echo -e "\n-------------------"

# Testing GET all users (admin only)
echo "Testing GET all users (admin only):"
curl -s http://localhost:3000/users \
-H "Authorization: Bearer $TOKEN" \
-H "Content-Type: application/json"
echo -e "\n-------------------"

# Testing GET single user
echo "Testing GET single user:"
curl -s http://localhost:3000/users/1 \
-H "Authorization: Bearer $TOKEN" \
-H "Content-Type: application/json"
echo -e "\n-------------------"
