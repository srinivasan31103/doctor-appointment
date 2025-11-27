@echo off
echo ========================================
echo Starting HealthCare+ (Frontend + Backend)
echo ========================================
echo.

echo Starting Backend Server...
start "HealthCare+ Backend" "%~dp0start-backend.bat"

timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "HealthCare+ Frontend" "%~dp0start-frontend.bat"

echo.
echo ========================================
echo Both servers are starting!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Close this window when you're done.
echo To stop servers, close their individual windows.
echo.

pause
