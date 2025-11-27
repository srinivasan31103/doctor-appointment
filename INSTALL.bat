@echo off
echo ========================================
echo HealthCare+ Installation Script
echo ========================================
echo.

echo Step 1: Installing Backend Dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo ERROR: Backend installation failed!
    pause
    exit /b 1
)
echo Backend dependencies installed successfully!
echo.

echo Step 2: Installing Frontend Dependencies...
cd ..\frontend
call npm install
if errorlevel 1 (
    echo ERROR: Frontend installation failed!
    pause
    exit /b 1
)
echo Frontend dependencies installed successfully!
echo.

echo Step 3: Creating environment files...
cd ..\backend
if not exist .env (
    copy .env.example .env
    echo Backend .env file created. Please update with your credentials.
)

cd ..\frontend
if not exist .env (
    copy .env.example .env
    echo Frontend .env file created.
)

cd ..

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Update backend/.env with your MongoDB URI and Claude API key
echo 2. Ensure MongoDB is running
echo 3. Run START.bat to start the application
echo.
echo Press any key to exit...
pause > nul
