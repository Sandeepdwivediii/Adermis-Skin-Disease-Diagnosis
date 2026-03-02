# Adermis Startup Script
Write-Host "🚀 Starting Adermis - AI Skin Disease Diagnosis Platform" -ForegroundColor Green
Write-Host ""
Write-Host "Backend: Flask API Gateway (Port 5000)" -ForegroundColor Cyan
Write-Host "Frontend: Next.js App (Port 3000)" -ForegroundColor Blue
Write-Host ""

# Get script directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Start backend in new PowerShell window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ScriptDir\Adermis-main\backend'; python gateway.py"

# Wait 3 seconds for backend to initialize
Start-Sleep -Seconds 3

# Start frontend in new PowerShell window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ScriptDir\Adermis-main\adermis'; npm run dev"

Write-Host ""
Write-Host "✅ Both servers are starting..." -ForegroundColor Green
Write-Host "📱 Frontend: http://localhost:3000" -ForegroundColor Blue
Write-Host "🔧 Backend: http://localhost:5000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to exit this script (servers will keep running)"
Read-Host