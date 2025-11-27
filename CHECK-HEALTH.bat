@echo off
SETLOCAL EnableDelayedExpansion

color 0B
title HealthCare+ System Check

cls
echo.
echo ================================================
echo   HEALTHCARE+ SYSTEM HEALTH CHECK
echo ================================================
echo.

REM Check 1: Node.js
echo [CHECK 1] Node.js Installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo [FAIL] Node.js is NOT installed
    echo        Download from: https://nodejs.org/
    set "STATUS_NODE=FAIL"
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VER=%%i
    echo [PASS] Node.js !NODE_VER!
    set "STATUS_NODE=PASS"
)
echo.

REM Check 2: npm
echo [CHECK 2] npm Installation...
npm --version >nul 2>&1
if errorlevel 1 (
    echo [FAIL] npm is NOT available
    set "STATUS_NPM=FAIL"
) else (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VER=%%i
    echo [PASS] npm !NPM_VER!
    set "STATUS_NPM=PASS"
)
echo.

REM Check 3: MongoDB
echo [CHECK 3] MongoDB Installation...
mongod --version >nul 2>&1
if errorlevel 1 (
    mongo --version >nul 2>&1
    if errorlevel 1 (
        echo [WARN] MongoDB not detected locally
        echo        You can use MongoDB Atlas (cloud)
        set "STATUS_MONGO=WARN"
    ) else (
        echo [PASS] MongoDB client installed
        set "STATUS_MONGO=PASS"
    )
) else (
    echo [PASS] MongoDB server installed
    set "STATUS_MONGO=PASS"
)
echo.

cd /d "%~dp0"

REM Check 4: Backend Dependencies
echo [CHECK 4] Backend Dependencies...
if exist "backend\node_modules" (
    echo [PASS] Backend dependencies installed
    set "STATUS_BACKEND_DEPS=PASS"
) else (
    echo [FAIL] Backend dependencies NOT installed
    echo        Run: cd backend ^&^& npm install
    set "STATUS_BACKEND_DEPS=FAIL"
)
echo.

REM Check 5: Frontend Dependencies
echo [CHECK 5] Frontend Dependencies...
if exist "frontend\node_modules" (
    echo [PASS] Frontend dependencies installed
    set "STATUS_FRONTEND_DEPS=PASS"
) else (
    echo [FAIL] Frontend dependencies NOT installed
    echo        Run: cd frontend ^&^& npm install
    set "STATUS_FRONTEND_DEPS=FAIL"
)
echo.

REM Check 6: Backend Configuration
echo [CHECK 6] Backend Configuration...
if exist "backend\.env" (
    echo [PASS] backend\.env file exists

    REM Check MongoDB URI
    findstr /C:"MONGODB_URI" backend\.env >nul 2>&1
    if errorlevel 1 (
        echo [WARN] MongoDB URI not found in .env
    ) else (
        echo [INFO] MongoDB URI configured
    )

    REM Check Claude API Key
    findstr /C:"your_claude_api_key_here" backend\.env >nul 2>&1
    if not errorlevel 1 (
        echo [WARN] Claude API key not configured
        echo        AI health advice will not work
        echo        Get key from: https://console.anthropic.com/
    ) else (
        echo [INFO] Claude API key configured
    )

    set "STATUS_BACKEND_CONFIG=PASS"
) else (
    echo [FAIL] backend\.env file missing
    echo        Copy from backend\.env.example
    set "STATUS_BACKEND_CONFIG=FAIL"
)
echo.

REM Check 7: Frontend Configuration
echo [CHECK 7] Frontend Configuration...
if exist "frontend\.env" (
    echo [PASS] frontend\.env file exists
    set "STATUS_FRONTEND_CONFIG=PASS"
) else (
    echo [INFO] frontend\.env file missing (optional)
    set "STATUS_FRONTEND_CONFIG=PASS"
)
echo.

REM Check 8: Backend Running
echo [CHECK 8] Backend Server Status...
curl -s http://localhost:5000 >nul 2>&1
if errorlevel 1 (
    echo [INFO] Backend is NOT running
    echo        Start with: RUN.bat or start-backend.bat
    set "STATUS_BACKEND_RUN=INFO"
) else (
    echo [PASS] Backend is RUNNING on port 5000
    set "STATUS_BACKEND_RUN=PASS"
)
echo.

REM Check 9: Frontend Running
echo [CHECK 9] Frontend Server Status...
curl -s http://localhost:3000 >nul 2>&1
if errorlevel 1 (
    echo [INFO] Frontend is NOT running
    echo        Start with: RUN.bat or start-frontend.bat
    set "STATUS_FRONTEND_RUN=INFO"
) else (
    echo [PASS] Frontend is RUNNING on port 3000
    set "STATUS_FRONTEND_RUN=PASS"
)
echo.

REM Summary
echo ================================================
echo   HEALTH CHECK SUMMARY
echo ================================================
echo.
echo   Node.js:              !STATUS_NODE!
echo   npm:                  !STATUS_NPM!
echo   MongoDB:              !STATUS_MONGO!
echo   Backend Dependencies: !STATUS_BACKEND_DEPS!
echo   Frontend Dependencies:!STATUS_FRONTEND_DEPS!
echo   Backend Config:       !STATUS_BACKEND_CONFIG!
echo   Frontend Config:      !STATUS_FRONTEND_CONFIG!
echo   Backend Running:      !STATUS_BACKEND_RUN!
echo   Frontend Running:     !STATUS_FRONTEND_RUN!
echo.
echo ================================================
echo.

if "!STATUS_NODE!"=="FAIL" (
    echo [ACTION NEEDED] Install Node.js
)
if "!STATUS_BACKEND_DEPS!"=="FAIL" (
    echo [ACTION NEEDED] Install backend dependencies
    echo                 Run: cd backend ^&^& npm install
)
if "!STATUS_FRONTEND_DEPS!"=="FAIL" (
    echo [ACTION NEEDED] Install frontend dependencies
    echo                 Run: cd frontend ^&^& npm install
)
if "!STATUS_BACKEND_CONFIG!"=="FAIL" (
    echo [ACTION NEEDED] Create backend\.env configuration
)
if "!STATUS_BACKEND_RUN!"=="INFO" (
    echo [READY TO START] Run: RUN.bat or SETUP-AND-RUN.bat
)

echo.
echo For detailed setup instructions, see:
echo   - START_HERE.md
echo   - SETUP_GUIDE.md
echo   - TROUBLESHOOTING.md
echo.
pause
