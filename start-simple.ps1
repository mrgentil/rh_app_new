Write-Host "🚀 Démarrage des serveurs RH App..." -ForegroundColor Green

# Tuer les processus sur les ports
Write-Host "🔍 Libération des ports..." -ForegroundColor Cyan

$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($port3000) {
    Write-Host "🔄 Arrêt du processus sur le port 3000..." -ForegroundColor Yellow
    Stop-Process -Id $port3000.OwningProcess -Force
    Start-Sleep -Seconds 2
}

$port3001 = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
if ($port3001) {
    Write-Host "🔄 Arrêt du processus sur le port 3001..." -ForegroundColor Yellow
    Stop-Process -Id $port3001.OwningProcess -Force
    Start-Sleep -Seconds 2
}

# Démarrer le backend
Write-Host "🔧 Démarrage du backend..." -ForegroundColor Cyan
Start-Process cmd -ArgumentList "/k", "cd backend && npm run dev" -WindowStyle Normal

Start-Sleep -Seconds 5

# Démarrer le frontend
Write-Host "🎨 Démarrage du frontend..." -ForegroundColor Cyan
Start-Process cmd -ArgumentList "/k", "cd frontend && npm run dev" -WindowStyle Normal

Start-Sleep -Seconds 5

# Ouvrir le navigateur
Write-Host "🌐 Ouverture du navigateur..." -ForegroundColor Cyan
Start-Process "http://localhost:3000"

Write-Host "`n🎉 Serveurs démarrés!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "Backend:  http://localhost:3001" -ForegroundColor White 