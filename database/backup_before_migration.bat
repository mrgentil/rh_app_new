@echo off
echo ========================================
echo SAUVEGARDE AVANT MIGRATION
echo ========================================

set BACKUP_DATE=%date:~6,4%-%date:~3,2%-%date:~0,2%_%time:~0,2%-%time:~3,2%-%time:~6,2%
set BACKUP_DATE=%BACKUP_DATE: =0%

echo Creation de la sauvegarde...
mysqldump -u root -p my_rh_app > backup_my_rh_app_%BACKUP_DATE%.sql

if %ERRORLEVEL% == 0 (
    echo ✅ Sauvegarde creee avec succes: backup_my_rh_app_%BACKUP_DATE%.sql
) else (
    echo ❌ Erreur lors de la sauvegarde!
    pause
    exit /b 1
)

echo.
echo ========================================
echo SAUVEGARDE TERMINEE
echo ========================================
pause
