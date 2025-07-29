@echo off
echo Configuration Gmail SMTP pour RH App
echo.

echo Pour utiliser Gmail SMTP, vous devez :
echo 1. Activer l'authentification à 2 facteurs sur votre compte Gmail
echo 2. Générer un mot de passe d'application
echo 3. Utiliser ce mot de passe dans la configuration
echo.

set /p GMAIL_EMAIL="Entrez votre adresse Gmail (ex: votreemail@gmail.com): "
set /p GMAIL_PASSWORD="Entrez votre mot de passe d'application Gmail: "

echo Création du fichier .env avec Gmail SMTP...
(
echo # Configuration de la base de données
echo DB_HOST=localhost
echo DB_PORT=3306
echo DB_NAME=rh_app
echo DB_USER=root
echo DB_PASS=
echo.
echo # Configuration du serveur
echo PORT=3001
echo NODE_ENV=development
echo.
echo # Configuration JWT
echo JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
echo.
echo # Configuration CORS
echo CORS_ORIGIN=http://localhost:3000
echo.
echo # Configuration Email ^(Gmail SMTP^)
echo EMAIL_HOST=smtp.gmail.com
echo EMAIL_PORT=587
echo EMAIL_USER=%GMAIL_EMAIL%
echo EMAIL_PASS=%GMAIL_PASSWORD%
echo.
echo # URL du frontend pour les liens dans les emails
echo FRONTEND_URL=http://localhost:3000
) > .env

echo ✅ Fichier .env créé avec succès !
echo.
echo 📧 Configuration email Gmail :
echo    - Host: smtp.gmail.com
echo    - Port: 587
echo    - User: %GMAIL_EMAIL%
echo    - Pass: [Mot de passe d'application]
echo.
echo 🔗 Pour configurer Gmail :
echo    1. Allez sur https://myaccount.google.com/security
echo    2. Activez l'authentification à 2 facteurs
echo    3. Générez un mot de passe d'application
echo    4. Utilisez ce mot de passe dans la configuration
echo.
pause 