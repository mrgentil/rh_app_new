@echo off
echo ========================================
echo    DEMARRAGE SIMPLE - RH APP
echo ========================================
echo.

echo 1. Verification des ports...
netstat -ano | findstr :3001 > nul
if %errorlevel% equ 0 (
    echo Port 3001 deja utilise - Arret du processus...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do taskkill /PID %%a /F >nul 2>&1
)

netstat -ano | findstr :3000 > nul
if %errorlevel% equ 0 (
    echo Port 3000 deja utilise - Arret du processus...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /PID %%a /F >nul 2>&1
)

echo.
echo 2. Demarrage du backend...
start "Backend" cmd /k "cd backend && npm run dev"

echo 3. Attente de 10 secondes...
timeout /t 10 /nobreak > nul

echo 4. Demarrage du frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo    APPLICATION DEMARREE !
echo ========================================
echo.
echo URLs:
echo - Frontend: http://localhost:3000
echo - Backend:  http://localhost:3001
echo.
echo Identifiants:
echo - Username: admin
echo - Password: admin123
echo.
echo Appuyez sur une touche pour fermer...
pause > nul 