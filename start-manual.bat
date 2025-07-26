@echo off
echo ========================================
echo    DEMARRAGE MANUEL - RH APP
echo ========================================
echo.

echo 1. Arret des processus existants...
taskkill /f /im node.exe >nul 2>&1

echo 2. Demarrage du backend...
echo Ouvrez un nouveau terminal et tapez:
echo cd backend
echo npm run dev
echo.
echo 3. Demarrage du frontend...
echo Ouvrez un autre terminal et tapez:
echo cd frontend
echo npm run dev
echo.

echo ========================================
echo    INSTRUCTIONS
echo ========================================
echo.
echo 1. Ouvrez 2 nouveaux terminaux
echo 2. Dans le premier: cd backend && npm run dev
echo 3. Dans le second: cd frontend && npm run dev
echo 4. Attendez que les deux soient prets
echo 5. Ouvrez http://localhost:3000
echo.
echo 🔑 Identifiants: admin / admin123
echo.
echo Appuyez sur une touche pour fermer...
pause > nul 