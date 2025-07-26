@echo off
echo ========================================
echo    DEMARRAGE COMPLET - RH APP
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

echo 3. Attente de 15 secondes pour le backend...
timeout /t 15 /nobreak > nul

echo 4. Test du backend...
cd backend
npm run simple-test
if %errorlevel% neq 0 (
    echo ❌ Erreur: Le backend ne fonctionne pas
    echo Attendez encore 10 secondes et reessayez...
    timeout /t 10 /nobreak > nul
    npm run simple-test
    if %errorlevel% neq 0 (
        echo ❌ Erreur: Le backend ne fonctionne toujours pas
        pause
        exit /b 1
    )
)

echo.
echo 5. Demarrage du frontend...
cd ..
start "Frontend" cmd /k "cd frontend && npm run dev"

echo 6. Attente de 20 secondes pour le frontend...
timeout /t 20 /nobreak > nul

echo.
echo ========================================
echo    APPLICATION DEMARREE !
echo ========================================
echo.
echo 🌐 URLs:
echo - Frontend: http://localhost:3000
echo - Backend:  http://localhost:3001
echo.
echo 🔑 Identifiants:
echo - Username: admin
echo - Password: admin123
echo.
echo 📋 Instructions:
echo 1. Ouvrez http://localhost:3000
echo 2. Si la page ne se charge pas, attendez 30 secondes
echo 3. Videz le cache: Ctrl+Shift+R
echo 4. Connectez-vous avec les identifiants admin
echo.
echo Appuyez sur une touche pour fermer...
pause > nul 