#!/bin/bash

echo "🚀 Starting SMAS Project..."

# Start backend in background
echo "📍 Starting Backend Server on port 3001..."
cd mini-services/backend
bun run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend
cd ../..
echo "📍 Starting Frontend on port 3000..."
bun run dev

# Kill backend on exit
trap "kill $BACKEND_PID" EXIT
