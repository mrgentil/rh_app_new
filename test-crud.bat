@echo off
echo ========================================
echo    TEST CRUD COMPLET - DEPARTEMENTS & ROLES
echo ========================================
echo.

echo 1. Test du Backend...
cd backend
npm run simple-test
echo.

echo 2. Test des routes CRUD...
echo Test GET /api/departments
curl -s http://localhost:3001/api/departments | head -20
echo.

echo Test GET /api/roles
curl -s http://localhost:3001/api/roles | head -20
echo.

echo 3. Test de création d'un département...
curl -X POST http://localhost:3001/api/departments ^
  -H "Content-Type: application/json" ^
  -H "Cookie: token=admin_token_here" ^
  -d "{\"name\":\"Test Department\",\"description\":\"Department de test\"}"
echo.

echo 4. Test de création d'un rôle...
curl -X POST http://localhost:3001/api/roles ^
  -H "Content-Type: application/json" ^
  -H "Cookie: token=admin_token_here" ^
  -d "{\"name\":\"Test Role\",\"description\":\"Role de test\"}"
echo.

echo ========================================
echo    TESTS TERMINES
echo ========================================
pause 