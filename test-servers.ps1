Write-Host "🚀 Test des serveurs ÉBENOR CRÉATION" -ForegroundColor Green
Write-Host ""

# Test Backend
Write-Host "📡 Test Backend (http://localhost:5000)" -ForegroundColor Yellow
try {
    $backendHealth = Invoke-RestMethod -Uri "http://localhost:5000/health" -Method Get -UseBasicParsing
    Write-Host "✅ Backend: OK - Uptime: $($backendHealth.uptime)s" -ForegroundColor Green
    
    $backendAPI = Invoke-RestMethod -Uri "http://localhost:5000/api" -Method Get -UseBasicParsing
    Write-Host "✅ API: $($backendAPI.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend: Erreur - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test Frontend
Write-Host "🌐 Test Frontend (http://localhost:3001)" -ForegroundColor Yellow
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:3001" -Method Get -UseBasicParsing -TimeoutSec 10
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "✅ Frontend: OK - Status: $($frontendResponse.StatusCode)" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Frontend: Status: $($frontendResponse.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Frontend: Erreur - $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Le frontend est peut-être encore en cours de démarrage..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📋 URLs disponibles:" -ForegroundColor Cyan
Write-Host "   Backend API: http://localhost:5000/api" -ForegroundColor White
Write-Host "   Backend Health: http://localhost:5000/health" -ForegroundColor White
Write-Host "   Frontend: http://localhost:3001" -ForegroundColor White
Write-Host ""
Write-Host "Endpoints d'authentification disponibles:" -ForegroundColor Cyan
Write-Host "   POST http://localhost:5000/api/auth/login" -ForegroundColor White
Write-Host "   GET  http://localhost:5000/api/auth/profile" -ForegroundColor White
Write-Host "   POST http://localhost:5000/api/test" -ForegroundColor White