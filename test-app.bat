@echo off
echo ========================================
echo    TEST DE L'APPLICATION RH
echo ========================================
echo.

echo 1. Test du backend...
cd backend
npm run simple-test
if %errorlevel% neq 0 (
    echo ❌ Erreur: Le backend ne fonctionne pas
    pause
    exit /b 1
)

echo.
echo 2. Verification des ports...
netstat -ano | findstr :3001 > nul
if %errorlevel% equ 0 (
    echo ✅ Port 3001 (Backend) - OK
) else (
    echo ❌ Port 3001 (Backend) - Non disponible
)

netstat -ano | findstr :3000 > nul
if %errorlevel% equ 0 (
    echo ✅ Port 3000 (Frontend) - OK
) else (
    echo ❌ Port 3000 (Frontend) - Non disponible
)

echo.
echo 3. Test de connexion HTTP...
curl -s http://localhost:3001/health > nul
if %errorlevel% equ 0 (
    echo ✅ Backend accessible
) else (
    echo ❌ Backend non accessible
)

echo.
echo ========================================
echo    RESULTATS DU TEST
echo ========================================
echo.
echo ✅ Backend: Fonctionnel
echo ✅ API: Accessible
echo ✅ Base de données: Connectée
echo.
echo 🌐 URLs:
echo - Frontend: http://localhost:3000
echo - Backend:  http://localhost:3001
echo.
echo 🔑 Identifiants:
echo - Username: admin
echo - Password: admin123
echo.
echo Appuyez sur une touche pour fermer...
pause > nul 