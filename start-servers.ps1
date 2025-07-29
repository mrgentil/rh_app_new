# Script pour démarrer les serveurs avec les bons ports
Write-Host "🚀 Démarrage des serveurs RH App..." -ForegroundColor Green

# Fonction pour tuer un processus sur un port
function Stop-ProcessOnPort {
    param($Port)
    $process = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($process) {
        Write-Host "🔄 Arrêt du processus sur le port $Port (PID: $($process.OwningProcess))..." -ForegroundColor Yellow
        Stop-Process -Id $process.OwningProcess -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
    }
}

# Libérer les ports
Write-Host "🔍 Libération des ports..." -ForegroundColor Cyan
Stop-ProcessOnPort 3000
Stop-ProcessOnPort 3001

# Démarrer le backend sur le port 3001
Write-Host "🔧 Démarrage du backend (port 3001)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev" -WindowStyle Normal

# Attendre que le backend démarre
Write-Host "⏳ Attente du démarrage du backend..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

# Démarrer le frontend sur le port 3000
Write-Host "🎨 Démarrage du frontend (port 3000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev" -WindowStyle Normal

# Attendre que le frontend démarre
Write-Host "⏳ Attente du démarrage du frontend..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Ouvrir le navigateur
Write-Host "🌐 Ouverture du navigateur..." -ForegroundColor Cyan
Start-Process "http://localhost:3000"

Write-Host "`n🎉 Serveurs démarrés avec succès!" -ForegroundColor Green
Write-Host "📋 URLs:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend:  http://localhost:3001" -ForegroundColor White
Write-Host "   Test API: http://localhost:3000/test-api" -ForegroundColor White
Write-Host "   Employés: http://localhost:3000/employes" -ForegroundColor White

Write-Host "`n💡 Pour arrêter les serveurs, fermez les fenêtres PowerShell" -ForegroundColor Yellow 