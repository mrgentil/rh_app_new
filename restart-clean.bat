@echo off
echo ========================================
echo    REDEMARRAGE COMPLET - RH APP
echo ========================================
echo.

echo 1. Arret de tous les processus Node.js...
taskkill /f /im node.exe >nul 2>&1

echo 2. Attente de 5 secondes...
timeout /t 5 /nobreak > nul

echo 3. Verification des ports...
netstat -ano | findstr :3001 > nul
if %errorlevel% equ 0 (
    echo Port 3001 encore utilise - Arret force...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do taskkill /PID %%a /F >nul 2>&1
)

netstat -ano | findstr :3000 > nul
if %errorlevel% equ 0 (
    echo Port 3000 encore utilise - Arret force...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /PID %%a /F >nul 2>&1
)

echo 4. Attente de 3 secondes...
timeout /t 3 /nobreak > nul

echo 5. Demarrage du backend...
start "Backend" cmd /k "cd backend && npm run dev"

echo 6. Attente de 20 secondes pour le backend...
timeout /t 20 /nobreak > nul

echo 7. Test du backend...
cd backend
npm run simple-test
if %errorlevel% neq 0 (
    echo ❌ Backend non accessible - Attente supplementaire...
    timeout /t 10 /nobreak > nul
    npm run simple-test
)

echo.
echo 8. Demarrage du frontend...
cd ..
start "Frontend" cmd /k "cd frontend && npm run dev"

echo 9. Attente de 15 secondes pour le frontend...
timeout /t 15 /nobreak > nul

echo.
echo ========================================
echo    APPLICATION REDEMARREE !
echo ========================================
echo.
echo 🌐 URLs de test:
echo - Frontend: http://localhost:3000
echo - Test simple: http://localhost:3000/test-simple
echo - Login: http://localhost:3000/login
echo - Backend: http://localhost:3001
echo.
echo 🔑 Identifiants:
echo - Username: admin
echo - Password: admin123
echo.
echo 📋 Instructions:
echo 1. Ouvrez http://localhost:3000/test-simple
echo 2. Si ça marche, testez http://localhost:3000/login
echo 3. Connectez-vous avec les identifiants admin
echo.
echo Appuyez sur une touche pour fermer...
pause > nul 