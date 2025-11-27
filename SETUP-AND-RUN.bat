@echo off
SETLOCAL EnableDelayedExpansion

REM ========================================
REM HealthCare+ Complete Setup & Run
REM ========================================

color 0B
title HealthCare+ Setup & Run

cls
echo.
echo     ================================================
echo          HEALTHCARE+ COMPLETE SETUP WIZARD
echo     ================================================
echo.
echo     This will set up and run your application
echo.
echo     ================================================
echo.

REM Step 1: Check Node.js
echo [1/7] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo.
    echo [ERROR] Node.js is NOT installed!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Download the LTS version (recommended)
    echo.
    pause
    exit /b 1
)
echo [OK] Node.js is installed:
node --version
echo.

REM Step 2: Check npm
echo [2/7] Checking npm...
npm --version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo [ERROR] npm is not available!
    pause
    exit /b 1
)
echo [OK] npm is installed:
npm --version
echo.

REM Step 3: Navigate to project
cd /d "%~dp0"
echo [3/7] Project directory: %CD%
echo.

REM Step 4: Backend Setup
echo [4/7] Setting up Backend...
cd backend

if not exist node_modules (
    echo [INSTALL] Installing backend dependencies...
    echo This may take a few minutes...
    call npm install --legacy-peer-deps
    if errorlevel 1 (
        color 0C
        echo [ERROR] Backend installation failed!
        pause
        exit /b 1
    )
    echo [OK] Backend dependencies installed
) else (
    echo [OK] Backend dependencies already installed
)

if not exist .env (
    echo [CONFIG] Creating backend .env file...
    (
        echo PORT=5000
        echo MONGODB_URI=mongodb://localhost:27017/healthcare-plus
        echo JWT_SECRET=healthcare_plus_jwt_secret_key_123456789_change_in_production
        echo CLAUDE_API_KEY=your_claude_api_key_here
        echo NODE_ENV=development
    ) > .env
    echo [CREATED] backend\.env file
    echo.
    echo IMPORTANT CONFIGURATION NEEDED:
    echo =====================================
    echo 1. MongoDB: Install from https://www.mongodb.com/try/download/community
    echo    OR use MongoDB Atlas: https://www.mongodb.com/cloud/atlas
    echo.
    echo 2. Claude API: Get free API key from https://console.anthropic.com/
    echo.
    echo 3. Update backend\.env with your MongoDB URI and Claude API key
    echo.
    set /p CONTINUE="Press Enter to continue (you can configure later)..."
) else (
    echo [OK] Backend .env exists
)

cd ..
echo.

REM Step 5: Frontend Setup
echo [5/7] Setting up Frontend...
cd frontend

if not exist node_modules (
    echo [INSTALL] Installing frontend dependencies...
    echo This may take a few minutes...
    call npm install --legacy-peer-deps
    if errorlevel 1 (
        color 0C
        echo [ERROR] Frontend installation failed!
        pause
        exit /b 1
    )
    echo [OK] Frontend dependencies installed
) else (
    echo [OK] Frontend dependencies already installed
)

if not exist .env (
    echo VITE_API_URL=http://localhost:5000/api > .env
    echo [CREATED] frontend\.env file
)

cd ..
echo.

REM Step 6: Configuration Check
echo [6/7] Configuration Check...
echo.
echo Checking backend\.env...
findstr /C:"your_claude_api_key_here" backend\.env >nul 2>&1
if not errorlevel 1 (
    color 0E
    echo [WARNING] Claude API key not configured!
    echo AI health advice will not work without it.
    echo Get your free API key: https://console.anthropic.com/
    echo.
)

findstr /C:"mongodb://localhost" backend\.env >nul 2>&1
if not errorlevel 1 (
    echo [INFO] Using local MongoDB connection
    echo Make sure MongoDB is running: mongod
    echo.
)

color 0A
echo [OK] Configuration check complete
echo.

REM Step 7: Start Application
echo [7/7] Starting Application...
echo.
echo ================================================
echo   LAUNCHING HEALTHCARE+
echo ================================================
echo.
echo Backend will start on:  http://localhost:5000
echo Frontend will start on: http://localhost:3000
echo.
echo Two windows will open:
echo   1. Backend Server (Express + MongoDB)
echo   2. Frontend Server (React + Vite)
echo.
echo Keep both windows open while using the app!
echo.

timeout /t 3 /nobreak >nul

REM Start Backend
echo Starting Backend Server...
start "HealthCare+ Backend" cmd /k "cd /d "%~dp0backend" && title HealthCare+ Backend && color 0A && cls && echo ======================================== && echo   HEALTHCARE+ BACKEND SERVER && echo ======================================== && echo. && echo Server starting... && echo. && echo API available at: http://localhost:5000 && echo. && node server.js"

echo Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

REM Start Frontend
echo Starting Frontend Server...
start "HealthCare+ Frontend" cmd /k "cd /d "%~dp0frontend" && title HealthCare+ Frontend && color 0B && cls && echo ======================================== && echo   HEALTHCARE+ FRONTEND SERVER && echo ======================================== && echo. && echo Dev server starting... && echo. && echo App available at: http://localhost:3000 && echo. && node node_modules\vite\bin\vite.js"

echo Waiting for frontend to start...
timeout /t 8 /nobreak >nul

cls
echo.
echo ================================================
echo   APPLICATION STARTED SUCCESSFULLY!
echo ================================================
echo.
echo   Backend:  http://localhost:5000
echo   Frontend: http://localhost:3000
echo.
echo ================================================
echo.
echo Opening your browser...
timeout /t 2 /nobreak >nul

REM Open browser
start http://localhost:3000

cls
echo.
echo ================================================
echo   HEALTHCARE+ IS RUNNING!
echo ================================================
echo.
echo   Open in browser: http://localhost:3000
echo.
echo   To stop the application:
echo   - Close the "HealthCare+ Backend" window
echo   - Close the "HealthCare+ Frontend" window
echo.
echo   Troubleshooting:
echo   - Check TROUBLESHOOTING.md
echo   - Check START_HERE.md
echo.
echo ================================================
echo.
echo This setup window can now be closed.
echo Or press any key to exit...
echo.
pause >nul
