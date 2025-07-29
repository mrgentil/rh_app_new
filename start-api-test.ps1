# Script PowerShell pour démarrer et tester l'API Employés
Write-Host "🚀 Démarrage de l'API Employés..." -ForegroundColor Green

# Fonction pour vérifier si un port est utilisé
function Test-Port {
    param($Port)
    $connection = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    return $connection -ne $null
}

# Fonction pour tuer un processus sur un port
function Stop-ProcessOnPort {
    param($Port)
    $process = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($process) {
        Write-Host "🔄 Arrêt du processus sur le port $Port..." -ForegroundColor Yellow
        Stop-Process -Id $process.OwningProcess -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
    }
}

# Vérifier et libérer les ports si nécessaire
Write-Host "🔍 Vérification des ports..." -ForegroundColor Cyan

if (Test-Port 3001) {
    Write-Host "⚠️  Le port 3001 est utilisé. Arrêt du processus..." -ForegroundColor Yellow
    Stop-ProcessOnPort 3001
}

if (Test-Port 3000) {
    Write-Host "⚠️  Le port 3000 est utilisé. Arrêt du processus..." -ForegroundColor Yellow
    Stop-ProcessOnPort 3000
}

# Démarrer le backend
Write-Host "🔧 Démarrage du backend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev" -WindowStyle Normal

# Attendre que le backend démarre
Write-Host "⏳ Attente du démarrage du backend..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Tester la connexion à l'API
Write-Host "🧪 Test de l'API..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/health" -Method Get -TimeoutSec 5
    Write-Host "✅ Backend démarré avec succès!" -ForegroundColor Green
    Write-Host "📊 Status: $($response.status)" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur lors du test de l'API: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Vérifiez que le backend est bien démarré" -ForegroundColor Yellow
}

# Démarrer le frontend
Write-Host "🎨 Démarrage du frontend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev" -WindowStyle Normal

# Attendre que le frontend démarre
Write-Host "⏳ Attente du démarrage du frontend..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Ouvrir le navigateur
Write-Host "🌐 Ouverture du navigateur..." -ForegroundColor Cyan
Start-Process "http://localhost:3000/test-api"

Write-Host "`n🎉 Configuration terminée!" -ForegroundColor Green
Write-Host "📋 Prochaines étapes:" -ForegroundColor Cyan
Write-Host "1. Vérifiez la page de test: http://localhost:3000/test-api" -ForegroundColor White
Write-Host "2. Allez sur la page des employés: http://localhost:3000/employes" -ForegroundColor White
Write-Host "3. Si pas de données, exécutez: cd backend; npm run seed" -ForegroundColor White
Write-Host "4. Puis: npx ts-node src/scripts/addTestEmployees.ts" -ForegroundColor White

Write-Host "`n💡 Pour arrêter les serveurs, fermez les fenêtres PowerShell" -ForegroundColor Yellow 