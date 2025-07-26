# Script PowerShell pour démarrer le backend sur le port 3001
$env:PORT = "3001"
Write-Host "🚀 Démarrage du backend sur le port 3001..." -ForegroundColor Green
npm run dev 