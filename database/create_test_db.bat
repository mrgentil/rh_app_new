@echo off
echo ========================================
echo CREATION BASE DE TEST
echo ========================================

echo Creation de la base de donnees de test...
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS my_rh_app_test;"

if %ERRORLEVEL% == 0 (
    echo ✅ Base de test creee: my_rh_app_test
) else (
    echo ❌ Erreur lors de la creation de la base de test!
    pause
    exit /b 1
)

echo.
echo Copie des donnees vers la base de test...
mysqldump -u root -p my_rh_app | mysql -u root -p my_rh_app_test

if %ERRORLEVEL% == 0 (
    echo ✅ Donnees copiees avec succes vers my_rh_app_test
) else (
    echo ❌ Erreur lors de la copie des donnees!
    pause
    exit /b 1
)

echo.
echo ========================================
echo BASE DE TEST PRETE
echo ========================================
pause
