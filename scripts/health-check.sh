#!/bin/bash

# Health check script for users API
# ISO 8601 timestamp with milliseconds
timestamp=$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")

# Make HEAD request to users API
echo "[$timestamp] Checking API health..."
response=$(curl -I -s -w "%{http_code}" http://localhost:3000/api/users)
status=$?

# Check response
if [ $status -eq 0 ]; then
    db_status=$(echo "$response" | grep -i "X-Database-Status:" | cut -d' ' -f2)
    response_time=$(echo "$response" | grep -i "X-Response-Time:" | cut -d' ' -f2)
    http_code=$(echo "$response" | tail -n1)

    if [ "$db_status" == "Connected" ] && [ "$http_code" == "200" ]; then
        echo "[$timestamp] Health check passed"
        echo "Database Status: $db_status"
        echo "Response Time: $response_time"
        exit 0
    else
        echo "[$timestamp] Health check failed"
        echo "Database Status: $db_status"
        echo "HTTP Code: $http_code"
        exit 1
    fi
else
    echo "[$timestamp] Health check failed - could not connect to API"
    exit 1
fi

