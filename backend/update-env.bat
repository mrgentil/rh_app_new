@echo off
echo ========================================
echo   Mise a jour de la configuration .env
echo ========================================
echo.

REM Vérifier si le fichier .env existe
if not exist ".env" (
    echo Le fichier .env n'existe pas. Creation...
    echo # Configuration Email (Gmail SMTP) > .env
    echo EMAIL_HOST=smtp.gmail.com >> .env
    echo EMAIL_PORT=587 >> .env
    echo EMAIL_USER= >> .env
    echo EMAIL_PASS= >> .env
    echo. >> .env
    echo # Configuration JWT >> .env
    echo JWT_SECRET=your-secret-key >> .env
    echo. >> .env
    echo # Configuration Frontend >> .env
    echo FRONTEND_URL=http://localhost:3000 >> .env
)

echo Configuration actuelle detectee:
echo.
echo MAIL_HOST=%MAIL_HOST%
echo MAIL_PORT=%MAIL_PORT%
echo MAIL_USERNAME=%MAIL_USERNAME%
echo MAIL_PASSWORD=%MAIL_PASSWORD%
echo.
echo MAIL_ENCRYPTION=%MAIL_ENCRYPTION%
echo MAIL_FROM_ADDRESS=%MAIL_FROM_ADDRESS%
echo.

echo Voulez-vous mettre a jour le fichier .env avec ces valeurs? (y/n)
set /p choice=

if /i "%choice%"=="y" (
    echo.
    echo Mise a jour du fichier .env...
    
    REM Sauvegarder l'ancien fichier
    if exist ".env" (
        copy ".env" ".env.backup" >nul
        echo Fichier .env sauvegarde dans .env.backup
    )
    
    REM Créer le nouveau fichier .env
    echo # Configuration Email (Gmail SMTP) > .env
    echo EMAIL_HOST=%MAIL_HOST% >> .env
    echo EMAIL_PORT=%MAIL_PORT% >> .env
    echo EMAIL_USER=%MAIL_USERNAME% >> .env
    echo EMAIL_PASS=%MAIL_PASSWORD% >> .env
    echo. >> .env
    echo # Configuration JWT >> .env
    echo JWT_SECRET=your-secret-key >> .env
    echo. >> .env
    echo # Configuration Frontend >> .env
    echo FRONTEND_URL=http://localhost:3000 >> .env
    
    echo.
    echo ✅ Fichier .env mis a jour avec succes!
    echo.
    echo Configuration mise a jour:
    echo - EMAIL_HOST=%MAIL_HOST%
    echo - EMAIL_PORT=%MAIL_PORT%
    echo - EMAIL_USER=%MAIL_USERNAME%
    echo - EMAIL_PASS=***masque***
    echo.
    echo Vous pouvez maintenant tester avec: npm run test-email-config
) else (
    echo.
    echo Mise a jour annulee.
    echo.
    echo Pour tester avec la configuration actuelle:
    echo npm run test-email-config
)

echo.
pause 