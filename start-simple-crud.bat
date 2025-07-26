@echo off
echo ========================================
echo    DEMARRAGE SIMPLE - PORT 3001
echo ========================================
echo.

echo 1. Arret des processus Node.js...
taskkill /f /im node.exe >nul 2>&1
echo.

echo 2. Demarrage Backend (port 3001)...
cd backend
set PORT=3001
start "Backend" cmd /k "npm run dev"
echo.

echo 3. Attente 5 secondes...
timeout /t 5 /nobreak >nul
echo.

echo 4. Demarrage Frontend (port 3000)...
cd ../frontend
start "Frontend" cmd /k "npm run dev"
echo.

echo ========================================
echo    PRET !
echo ========================================
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:3000
echo Login:    admin / admin123
echo ========================================
pause 