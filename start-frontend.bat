@echo off
echo ========================================
echo Starting HealthCare+ Frontend
echo ========================================
echo.

cd /d "%~dp0frontend"

echo Checking if node_modules exists...
if not exist "node_modules" (
    echo node_modules not found. Installing dependencies...
    call npm install
)

echo.
echo Starting Vite development server...
echo Frontend will be available at: http://localhost:3000
echo.

node node_modules\vite\bin\vite.js

pause
