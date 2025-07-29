@echo off
echo 🚀 Démarrage des serveurs RH App...

echo 🔍 Libération des ports...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    echo 🔄 Arrêt du processus sur le port 3000 (PID: %%a)
    taskkill /PID %%a /F >nul 2>&1
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do (
    echo 🔄 Arrêt du processus sur le port 3001 (PID: %%a)
    taskkill /PID %%a /F >nul 2>&1
)

echo.
echo 🔧 Démarrage du backend (port 3001)...
start "Backend" cmd /k "cd backend && npm run dev"

echo ⏳ Attente du démarrage du backend...
timeout /t 8 /nobreak >nul

echo 🎨 Démarrage du frontend (port 3000)...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo ⏳ Attente du démarrage du frontend...
timeout /t 10 /nobreak >nul

echo 🌐 Ouverture du navigateur...
start http://localhost:3000

echo.
echo 🎉 Serveurs démarrés avec succès!
echo 📋 URLs:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:3001
echo    Test API: http://localhost:3000/test-api
echo    Employés: http://localhost:3000/employes
echo.
echo 💡 Pour arrêter les serveurs, fermez les fenêtres cmd
pause 