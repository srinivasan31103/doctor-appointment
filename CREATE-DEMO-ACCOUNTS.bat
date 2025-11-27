@echo off
color 0A
title Create Demo Accounts

cls
echo.
echo ========================================
echo   CREATE DEMO ACCOUNTS
echo ========================================
echo.
echo This will create 3 demo accounts:
echo.
echo   1. Admin   - admin@healthcare.com
echo   2. Doctor  - doctor@healthcare.com
echo   3. Patient - user@healthcare.com
echo.
echo All passwords: Same as role (admin123, doctor123, user123)
echo.
echo ========================================
echo.

REM Check if MongoDB is running
echo Checking MongoDB connection...
cd /d "%~dp0backend"

REM Check if .env exists
if not exist .env (
    echo.
    echo [ERROR] backend\.env file not found!
    echo Please run SETUP-AND-RUN.bat first.
    echo.
    pause
    exit /b 1
)

echo.
echo Creating demo accounts...
echo Please wait...
echo.

node seeders\createDemoAccounts.js

if errorlevel 1 (
    echo.
    echo ========================================
    echo   ERROR!
    echo ========================================
    echo.
    echo Make sure:
    echo   1. MongoDB is running (run: mongod)
    echo   2. backend\.env is configured
    echo   3. Dependencies are installed
    echo.
    echo Or use MongoDB Atlas (cloud database)
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   SUCCESS!
echo ========================================
echo.
echo Demo accounts have been created!
echo You can now login with these credentials.
echo.
pause
