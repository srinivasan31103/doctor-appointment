@echo off
echo ========================================
echo Move HealthCare+ to Fix Path Issues
echo ========================================
echo.
echo This will move the project from:
echo   FROM: E:\Sri\Smart Health ^& Doctor Appointment System\healthcare-plus
echo   TO:   E:\Sri\healthcare-plus
echo.
echo This fixes the "Doctor is not recognized" error!
echo.

pause

echo.
echo Moving project...
move "%~dp0." "E:\Sri\healthcare-plus-temp"

if errorlevel 1 (
    echo Error moving project!
    pause
    exit /b 1
)

move "E:\Sri\healthcare-plus-temp" "E:\Sri\healthcare-plus"

echo.
echo ========================================
echo SUCCESS!
echo ========================================
echo.
echo Project moved to: E:\Sri\healthcare-plus
echo.
echo Next steps:
echo 1. Navigate to: E:\Sri\healthcare-plus
echo 2. Double-click: start-both.bat
echo 3. Open browser: http://localhost:3000
echo.

pause
