@echo off
echo ========================================
echo    TEST SIMPLE - LOGIN
echo ========================================
echo.

echo 1. Test du backend...
powershell -Command "Invoke-WebRequest -Uri 'http://localhost:3001/health' -UseBasicParsing | Select-Object -ExpandProperty Content"
echo.
echo.

echo 2. Test du frontend...
powershell -Command "Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing | Select-Object -ExpandProperty StatusCode"
echo.
echo.

echo ========================================
echo    OUVREZ VOTRE NAVIGATEUR
echo ========================================
echo.
echo URL: http://localhost:3000
echo Login: admin / admin123
echo.
echo Si la page ne se charge pas, vérifiez:
echo 1. Backend sur port 3001
echo 2. Frontend sur port 3000
echo 3. Console du navigateur (F12)
echo ========================================
pause 