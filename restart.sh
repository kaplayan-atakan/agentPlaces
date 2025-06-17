#!/bin/bash

# AgentPlaces - Complete Restart Script
# Tüm servisleri durdurup yeniden başlatır

echo "🔄 AgentPlaces servislerini yeniden başlatılıyor..."

# 1. Node.js süreçlerini durdur
echo "📛 Node.js süreçleri durduruluyor..."
pkill -f node 2>/dev/null || echo "   ℹ️ Node.js süreçleri zaten durdurulmuş"
echo "   ✅ Node.js süreçleri durduruldu"

# 2. Docker servislerini yeniden başlat
echo "🐳 Docker servisleri yeniden başlatılıyor..."
cd "$(dirname "$0")"
docker-compose down
docker-compose up -d

# Servislerin başlamasını bekle
echo "⏳ Docker servisleri başlatılıyor..."
sleep 10

# 3. Backend'i başlat
echo "🚀 Backend başlatılıyor (Port 2809)..."
cd backend
nohup npm run start:dev > /dev/null 2>&1 &
BACKEND_PID=$!
cd ..

# Backend'in başlamasını bekle
sleep 5

# 4. Frontend'i başlat
echo "⚛️ Frontend başlatılıyor (Port 3009)..."
cd frontend
nohup npm start > /dev/null 2>&1 &
FRONTEND_PID=$!
cd ..

echo "✅ Tüm servisler başlatıldı!"
echo ""
echo "📊 Servis URL'leri:"
echo "   🔗 Backend API: http://localhost:2809/api"
echo "   🔗 Frontend: http://localhost:3009"
echo "   🔗 MinIO Console: http://localhost:9001"
echo "   🔗 MailHog Web UI: http://localhost:8025"
echo ""
echo "📋 Manuel durdurma için:"
echo "   pkill -f node"
echo "   docker-compose down"
