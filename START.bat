@echo off
echo ========================================
echo Starting HealthCare+ Application
echo ========================================
echo.

echo Starting Backend Server...
start "HealthCare+ Backend" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "HealthCare+ Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo Application Started!
echo ========================================
echo.
echo Backend running on: http://localhost:5000
echo Frontend running on: http://localhost:3000
echo.
echo Press any key to close this window...
pause > nul
