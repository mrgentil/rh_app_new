@echo off
echo ========================================
echo    DEMARRAGE DE L'APPLICATION RH
echo ========================================
echo.

echo 1. Demarrage du backend...
start "Backend RH App" cmd /k "cd backend && npm run dev"

echo 2. Attente de 5 secondes...
timeout /t 5 /nobreak > nul

echo 3. Demarrage du frontend...
start "Frontend RH App" cmd /k "cd frontend && npm run dev"

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
echo Appuyez sur une touche pour fermer...
pause > nul 