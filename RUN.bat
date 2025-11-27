@echo off
SETLOCAL EnableDelayedExpansion

REM ========================================
REM HealthCare+ Ultimate Launcher
REM ========================================

color 0A
title HealthCare+ Launcher

cls
echo.
echo     ========================================
echo          HEALTHCARE+ APPLICATION
echo     ========================================
echo.
echo     Smart Health Management System
echo     Built with MERN Stack + Claude AI
echo.
echo     ========================================
echo.

REM Check Node.js installation
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js is installed
node --version

REM Check MongoDB
echo.
echo Checking MongoDB...
mongo --version >nul 2>&1
if errorlevel 1 (
    mongod --version >nul 2>&1
    if errorlevel 1 (
        echo [WARNING] MongoDB not detected locally
        echo You can use MongoDB Atlas cloud database
    ) else (
        echo [OK] MongoDB is installed
    )
) else (
    echo [OK] MongoDB is installed
)

REM Navigate to project directory
cd /d "%~dp0"

REM Check backend dependencies
echo.
echo Checking backend dependencies...
if not exist "backend\node_modules" (
    echo [INSTALL] Installing backend dependencies...
    cd backend
    call npm install --legacy-peer-deps
    cd ..
) else (
    echo [OK] Backend dependencies installed
)

REM Check frontend dependencies
echo.
echo Checking frontend dependencies...
if not exist "frontend\node_modules" (
    echo [INSTALL] Installing frontend dependencies...
    cd frontend
    call npm install --legacy-peer-deps
    cd ..
) else (
    echo [OK] Frontend dependencies installed
)

REM Check backend .env
echo.
echo Checking backend configuration...
if not exist "backend\.env" (
    echo [CONFIG] Creating backend .env file...
    copy "backend\.env.example" "backend\.env" >nul
    echo [CREATED] backend\.env file created
    echo.
    echo IMPORTANT: Please configure backend\.env with:
    echo   - MongoDB URI
    echo   - Claude API Key
    echo.
) else (
    echo [OK] Backend .env file exists
)

REM Check frontend .env
if not exist "frontend\.env" (
    copy "frontend\.env.example" "frontend\.env" >nul 2>&1
)

echo.
echo ========================================
echo   STARTING APPLICATION...
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press Ctrl+C in each window to stop servers
echo.

timeout /t 2 /nobreak >nul

REM Start Backend
echo Starting Backend Server...
start "HealthCare+ Backend" cmd /k "cd /d "%~dp0backend" && echo ======================================== && echo   HEALTHCARE+ BACKEND SERVER && echo ======================================== && echo. && echo Starting Express server... && echo. && node server.js"

REM Wait a bit for backend to start
timeout /t 3 /nobreak >nul

REM Start Frontend
echo Starting Frontend Server...
start "HealthCare+ Frontend" cmd /k "cd /d "%~dp0frontend" && echo ======================================== && echo   HEALTHCARE+ FRONTEND SERVER && echo ======================================== && echo. && echo Starting Vite dev server... && echo. && node node_modules\vite\bin\vite.js"

REM Wait for services to start
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo   APPLICATION STARTED SUCCESSFULLY!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Opening browser...
timeout /t 3 /nobreak >nul

REM Open browser
start http://localhost:3000

echo.
echo ========================================
echo   ENJOY HEALTHCARE+!
echo ========================================
echo.
echo To stop the application:
echo   - Close the Backend window
echo   - Close the Frontend window
echo.
echo This launcher window can be closed now.
echo.
pause
