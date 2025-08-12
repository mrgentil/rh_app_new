@echo off
echo ========================================
echo TEST DE MIGRATION SUR BASE DE TEST
echo ========================================

echo Test de la migration sur my_rh_app_test...
mysql -u root -p my_rh_app_test < safe_migration.sql

if %ERRORLEVEL% == 0 (
    echo ✅ Migration testee avec succes sur my_rh_app_test
    echo.
    echo Verification des nouvelles tables...
    mysql -u root -p my_rh_app_test -e "SHOW TABLES LIKE 'tasks'; SHOW TABLES LIKE 'channels'; SHOW TABLES LIKE 'badges';"
) else (
    echo ❌ Erreur lors du test de migration!
    echo Verifiez les erreurs ci-dessus avant de continuer.
    pause
    exit /b 1
)

echo.
echo ========================================
echo TEST TERMINE - Verifiez les resultats
echo ========================================
pause
