@echo off
echo ========================================
echo Starting HealthCare+ Backend
echo ========================================
echo.

cd /d "%~dp0backend"

echo Checking if node_modules exists...
if not exist "node_modules" (
    echo node_modules not found. Installing dependencies...
    call npm install
)

echo.
echo Checking if .env file exists...
if not exist ".env" (
    echo WARNING: .env file not found!
    echo Creating .env from example...
    copy .env.example .env
    echo.
    echo IMPORTANT: Please update backend\.env with your:
    echo   - MongoDB URI
    echo   - Claude API key
    echo.
    pause
)

echo.
echo Starting Express server...
echo Backend API will be available at: http://localhost:5000
echo.

node server.js

pause
