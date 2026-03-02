@echo off
echo Starting Adermis - AI Skin Disease Diagnosis Platform
echo.
echo Backend: Flask API Gateway (Port 5000)
echo Frontend: Next.js App (Port 3000)
echo.

REM Start backend in new window
start "Adermis Backend" cmd /k "cd /d "%~dp0Adermis-main\backend" && python gateway.py"

REM Wait 3 seconds for backend to start
timeout /t 3 /nobreak > nul

REM Start frontend in new window  
start "Adermis Frontend" cmd /k "cd /d "%~dp0Adermis-main\adermis" && npm run dev"

echo.
echo ✅ Both servers are starting...
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend: http://localhost:5000
echo.
echo Press any key to exit this script (servers will keep running)
pause > nul