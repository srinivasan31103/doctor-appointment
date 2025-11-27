@echo off
color 0A
title HealthCare+ - Starting Servers

cls
echo.
echo ╔══════════════════════════════════════════╗
echo ║   HEALTHCARE+ STARTING...                ║
echo ╚══════════════════════════════════════════╝
echo.

cd /d "%~dp0"

REM Kill any existing processes on ports 5000 and 3000
echo [1/4] Checking for existing servers...
netstat -ano | findstr ":5000" >nul 2>&1
if not errorlevel 1 (
    echo Found server on port 5000, cleaning up...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5000"') do (
        taskkill /F /PID %%a >nul 2>&1
    )
)

netstat -ano | findstr ":3000" >nul 2>&1
if not errorlevel 1 (
    echo Found server on port 3000, cleaning up...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000"') do (
        taskkill /F /PID %%a >nul 2>&1
    )
)
echo [OK] Ports are clear
echo.

REM Start Backend
echo [2/4] Starting Backend Server...
start "HealthCare+ Backend" cmd /k "color 0A && cd /d "%~dp0backend" && title HealthCare+ Backend && cls && echo ════════════════════════════════ && echo   HEALTHCARE+ BACKEND SERVER && echo ════════════════════════════════ && echo. && echo Starting on: http://localhost:5000 && echo. && node server.js"

echo [OK] Backend starting...
echo.

REM Wait for backend
echo [3/4] Waiting for backend to initialize...
timeout /t 5 /nobreak >nul
echo [OK] Backend ready
echo.

REM Start Frontend
echo [4/4] Starting Frontend Server...
start "HealthCare+ Frontend" cmd /k "color 0B && cd /d "%~dp0frontend" && title HealthCare+ Frontend && cls && echo ════════════════════════════════ && echo   HEALTHCARE+ FRONTEND SERVER && echo ════════════════════════════════ && echo. && echo Starting on: http://localhost:3000 && echo. && node node_modules\vite\bin\vite.js"

echo [OK] Frontend starting...
echo.

REM Wait for frontend
echo Waiting for frontend to start...
timeout /t 8 /nobreak >nul

cls
echo.
echo ╔══════════════════════════════════════════╗
echo ║   HEALTHCARE+ IS NOW RUNNING!            ║
echo ╚══════════════════════════════════════════╝
echo.
echo ✓ Backend:  http://localhost:5000
echo ✓ Frontend: http://localhost:3000
echo.
echo ════════════════════════════════════════════
echo   LOGIN CREDENTIALS:
echo ════════════════════════════════════════════
echo.
echo   PATIENT:
echo   Email:    user@healthcare.com
echo   Password: user123
echo.
echo   DOCTOR:
echo   Email:    doctor@healthcare.com
echo   Password: doctor123
echo.
echo   ADMIN:
echo   Email:    admin@healthcare.com
echo   Password: admin123
echo.
echo ════════════════════════════════════════════
echo.
echo Opening browser...
timeout /t 2 /nobreak >nul

REM Open browser
start http://localhost:3000

echo.
echo Browser opened!
echo.
echo Keep the Backend and Frontend windows open.
echo Close them to stop the application.
echo.
echo This window can be closed now.
echo.
pause
