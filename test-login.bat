@echo off
echo ========================================
echo    TEST DE CONNEXION - LOGIN
echo ========================================
echo.

echo 1. Test du backend (port 3001)...
curl -s http://localhost:3001/health
echo.
echo.

echo 2. Test de l'API auth/me...
curl -s http://localhost:3001/api/auth/me
echo.
echo.

echo 3. Test de l'API auth/login...
curl -X POST http://localhost:3001/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
echo.
echo.

echo 4. Test du frontend (port 3000)...
curl -s http://localhost:3000 | findstr "title"
echo.
echo.

echo ========================================
echo    TESTS TERMINES
echo ========================================
echo.
echo Si tout fonctionne, ouvrez: http://localhost:3000
echo Identifiants: admin / admin123
echo ========================================
pause 