# AgentPlaces - Complete Restart Script (PowerShell)
# Tüm servisleri durdurup yeniden başlatır

Write-Host "🔄 AgentPlaces servislerini yeniden başlatılıyor..." -ForegroundColor Cyan

# 1. Tüm Node.js süreçlerini durdur
Write-Host "📛 Node.js süreçleri durduruluyor..." -ForegroundColor Yellow
try {
    taskkill /f /im node.exe
    Write-Host "   ✅ Node.js süreçleri durduruldu" -ForegroundColor Green
} catch {
    Write-Host "   ℹ️ Node.js süreçleri zaten durdurulmuş" -ForegroundColor Gray
}

# 2. Docker servislerini yeniden başlat
Write-Host "🐳 Docker servisleri yeniden başlatılıyor..." -ForegroundColor Blue
Set-Location $PSScriptRoot
docker-compose down
docker-compose up -d

# Servislerin başlamasını bekle
Write-Host "⏳ Docker servisleri başlatılıyor..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# 3. Backend'i başlat
Write-Host "🚀 Backend başlatılıyor (Port 2809)..." -ForegroundColor Green
Set-Location "backend"
Start-Process -FilePath "powershell" -ArgumentList "-Command", "npm run start:dev" -WindowStyle Minimized
Set-Location ".."

# Backend'in başlamasını bekle
Start-Sleep -Seconds 15

# 4. Frontend'i başlat
Write-Host "⚛️ Frontend başlatılıyor (Port 3009)..." -ForegroundColor Magenta
Set-Location "frontend"
Start-Process -FilePath "powershell" -ArgumentList "-Command", "npm start" -WindowStyle Minimized
Set-Location ".."

Write-Host "✅ Tüm servisler başlatıldı!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Servis URL'leri:" -ForegroundColor Cyan
Write-Host "   🔗 Backend API: http://localhost:2809/api" -ForegroundColor White
Write-Host "   🔗 Frontend: http://localhost:3009" -ForegroundColor White
Write-Host "   🔗 MinIO Console: http://localhost:9001" -ForegroundColor White
Write-Host "   🔗 MailHog Web UI: http://localhost:8025" -ForegroundColor White
Write-Host ""
Write-Host "📋 Manuel durdurma için:" -ForegroundColor Yellow
Write-Host "   taskkill /f /im node.exe" -ForegroundColor Gray
Write-Host "   docker-compose down" -ForegroundColor Gray
