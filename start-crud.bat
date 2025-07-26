@echo off
echo ========================================
echo    DEMARRAGE CRUD COMPLET - DEPARTEMENTS & ROLES
echo ========================================
echo.

echo 1. Arret des processus Node.js existants...
taskkill /f /im node.exe >nul 2>&1
echo.

echo 2. Demarrage du Backend (port 3001)...
cd backend
set PORT=3001
start "Backend" cmd /k "npm start"
echo.

echo 3. Attente du demarrage du backend...
timeout /t 5 /nobreak >nul
echo.

echo 4. Test du backend...
curl -s http://localhost:3001/health
echo.
echo.

echo 5. Demarrage du Frontend (port 3000)...
cd ../frontend
start "Frontend" cmd /k "npm run dev"
echo.

echo 6. Attente du demarrage du frontend...
timeout /t 10 /nobreak >nul
echo.

echo ========================================
echo    APPLICATION DEMARREE !
echo ========================================
echo.
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo Identifiants de test:
echo - Username: admin
echo - Password: admin123
echo.
echo Testez le CRUD dans l'interface admin !
echo ========================================
pause 