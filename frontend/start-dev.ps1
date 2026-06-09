# SMAS Project - Development Start Script

Write-Host "🚀 Starting SMAS Project..." -ForegroundColor Cyan

# Start backend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\mini-services\backend'; Write-Host '📍 Starting Backend Server on port 3001...' -ForegroundColor Green; bun run dev"

# Wait for backend to start
Start-Sleep -Seconds 3

# Start frontend
Write-Host "📍 Starting Frontend on port 3000..." -ForegroundColor Green
bun run dev
