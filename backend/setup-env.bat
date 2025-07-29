@echo off
echo Configuration des variables d'environnement pour RH App
echo.

echo Création du fichier .env...
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
echo # Configuration Email ^(Mailtrap^)
echo EMAIL_HOST=sandbox.smtp.mailtrap.io
echo EMAIL_PORT=2525
echo EMAIL_USER=3f4f39b2ec163b
echo EMAIL_PASS=a3218bdf1ff3a1
echo.
echo # URL du frontend pour les liens dans les emails
echo FRONTEND_URL=http://localhost:3000
) > .env

echo ✅ Fichier .env créé avec succès !
echo.
echo 📧 Configuration email Mailtrap :
echo    - Host: sandbox.smtp.mailtrap.io
echo    - Port: 2525
echo    - User: 3f4f39b2ec163b
echo    - Pass: a3218bdf1ff3a1
echo.
echo 🔗 Pour voir vos emails :
echo    1. Allez sur https://mailtrap.io
echo    2. Connectez-vous avec vos identifiants
echo    3. Vérifiez votre boîte "Inboxes"
echo.
pause 