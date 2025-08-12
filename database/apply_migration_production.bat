@echo off
echo ========================================
echo MIGRATION EN PRODUCTION
echo ⚠️  ATTENTION: PRODUCTION DATABASE ⚠️
echo ========================================

echo.
echo VERIFICATIONS AVANT MIGRATION:
echo 1. Avez-vous teste la migration sur my_rh_app_test ? (O/N)
set /p tested="Reponse: "
if /i not "%tested%"=="O" (
    echo ❌ Testez d'abord sur la base de test!
    pause
    exit /b 1
)

echo 2. Avez-vous fait une sauvegarde de my_rh_app ? (O/N)
set /p backup="Reponse: "
if /i not "%backup%"=="O" (
    echo ❌ Faites d'abord une sauvegarde!
    echo Executez: backup_before_migration.bat
    pause
    exit /b 1
)

echo 3. Etes-vous sur de vouloir continuer ? (O/N)
set /p confirm="Reponse: "
if /i not "%confirm%"=="O" (
    echo Migration annulee.
    pause
    exit /b 0
)

echo.
echo ========================================
echo EXECUTION DE LA MIGRATION
echo ========================================

echo Application de la migration sur my_rh_app...
mysql -u root -p my_rh_app < safe_migration.sql

if %ERRORLEVEL% == 0 (
    echo ✅ Migration appliquee avec succes sur my_rh_app
    echo.
    echo Verification des nouvelles tables...
    mysql -u root -p my_rh_app -e "SELECT COUNT(*) as nouvelles_tables FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'my_rh_app' AND TABLE_NAME IN ('tasks', 'channels', 'badges', 'time_tracking');"
) else (
    echo ❌ Erreur lors de la migration en production!
    echo.
    echo RESTAURATION RECOMMANDEE:
    echo 1. Supprimez la base corrompue
    echo 2. Restaurez depuis la sauvegarde
    pause
    exit /b 1
)

echo.
echo ========================================
echo MIGRATION PRODUCTION TERMINEE
echo ========================================
pause
