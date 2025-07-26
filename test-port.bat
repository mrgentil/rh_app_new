@echo off
echo ========================================
echo    TEST PORT 3001
echo ========================================
echo.

echo 1. Test du serveur backend...
curl -s http://localhost:3001/health
echo.
echo.

echo 2. Test de l'API departements...
curl -s http://localhost:3001/api/departments
echo.
echo.

echo 3. Test de l'API roles...
curl -s http://localhost:3001/api/roles
echo.
echo.

echo ========================================
echo    TESTS TERMINES
echo ========================================
pause 