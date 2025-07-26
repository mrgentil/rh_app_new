@echo off
echo ========================================
echo    DEMARRAGE ROBUSTE - RH APP
echo ========================================
echo.

echo 1. Arret des processus existants...
taskkill /f /im node.exe >nul 2>&1

echo 2. Demarrage du backend...
start "Backend" cmd /k "cd backend && npm run dev"

echo 3. Attente du backend (30 secondes)...
timeout /t 30 /nobreak > nul

echo 4. Test du backend...
cd backend
:test_loop
npm run simple-test >nul 2>&1
if %errorlevel% neq 0 (
    echo Attente du backend... (5 secondes)
    timeout /t 5 /nobreak > nul
    goto test_loop
)

echo ✅ Backend pret !

echo.
echo 5. Demarrage du frontend...
cd ..
start "Frontend" cmd /k "cd frontend && npm run dev"

echo 6. Attente du frontend (20 secondes)...
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