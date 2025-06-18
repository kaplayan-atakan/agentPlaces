# 🚀 AgentPlaces Production Deployment Rehberi

## 📋 İçindekiler
1. [Ön Koşullar](#-ön-koşullar)
2. [Hesap Kurulumları](#-hesap-kurulumları)
3. [Repository Hazırlığı](#-repository-hazırlığı)
4. [Frontend Deployment (GitHub Pages)](#-frontend-deployment-github-pages)
5. [Backend Deployment (Render)](#-backend-deployment-render)
6. [Database Setup](#-database-setup)
7. [Environment Variables](#-environment-variables)
8. [Domain ve SSL](#-domain-ve-ssl)
9. [Monitoring ve Maintenance](#-monitoring-ve-maintenance)
10. [Troubleshooting](#-troubleshooting)

---

## 🎯 Ön Koşullar

### Gerekli Hesaplar
- ✅ **GitHub** hesabı (ücretsiz)
- ✅ **Render** hesabı (ücretsiz tier mevcut - https://render.com)
- ✅ **MongoDB Atlas** hesabı (ücretsiz tier 512MB)
- 🔸 **Cloudflare** hesabı (opsiyonel - CDN için)

### Yerel Geliştirme Ortamı
- ✅ **Node.js** 18+ kurulu
- ✅ **Git** kurulu ve yapılandırılmış
- ✅ **npm** veya **yarn** package manager
- ✅ **VS Code** veya benzeri editor

### Proje Durumu Kontrolü
```powershell
# Proje klasörünüzde
cd c:\aaa\agentPlaces

# Dosya yapısı kontrolü
dir
# Görmeli: frontend/, backend/, .github/, render.yaml, DEPLOYMENT-GUIDE.md

# Git durumu kontrolü
git status
git log --oneline -5
```

---

## 🏗️ Hesap Kurulumları

### 1. GitHub Hesabı ve Repository
```bash
# Repository'niz zaten mevcut ama kontrol edelim
git remote -v
# origin https://github.com/KULLANICI_ADI/agentPlaces.git olmalı

# Eğer remote yok ise
git remote add origin https://github.com/KULLANICI_ADI/agentPlaces.git
```

### 2. Render Hesabı Setup
1. **Kayıt Ol**: https://render.com adresine git
2. **GitHub ile bağlan**: "Connect GitHub" butonuna tıkla
3. **Repository erişimi ver**: agentPlaces repository'sine erişim ver
4. **Dashboard'a git**: https://dashboard.render.com

### 3. MongoDB Atlas Setup
1. **Kayıt Ol**: https://www.mongodb.com/atlas
2. **Cluster Oluştur**:
   - Ücretsiz M0 tier seç
   - Region: Virginia (us-east-1) seç
   - Cluster adı: `agentplaces-cluster`
3. **Database User Oluştur**:
   - Username: `agentplaces`
   - Password: Güçlü bir şifre oluştur ve kaydet
4. **Network Access**:
   - "Add IP Address" tıkla
   - "Allow access from anywhere" (0.0.0.0/0) seç

---

## 📁 Repository Hazırlığı

### 1. Son Kod Kontrolü
```powershell
cd c:\aaa\agentPlaces

# Tüm değişiklikleri commit et
git add .
git commit -m "Production deployment setup completed"
git push origin main
```

### 2. Gerekli Dosyaların Varlığı Kontrolü
```powershell
# Frontend
Test-Path "frontend/package.json"        # True olmalı
Test-Path "frontend/src/config/api.js"   # True olmalı
Test-Path "frontend/.env.example"        # True olmalı

# Backend
Test-Path "backend/package.json"                    # True olmalı
Test-Path "backend/src/config/configuration.ts"     # True olmalı
Test-Path "backend/src/worker.ts"                   # True olmalı
Test-Path "backend/.env.example"                    # True olmalı

# Root
Test-Path "render.yaml"                             # True olmalı
Test-Path ".github/workflows/deploy-frontend.yml"  # True olmalı
```

### 3. Build Test
```powershell
# Frontend build test
cd frontend
npm ci
npm run build
# "Compiled successfully" mesajı görmeli

# Backend build test  
cd ..\backend
npm ci
npm run build
# Hata olmadan tamamlanmalı

cd ..
```

---

## 🌐 Frontend Deployment (GitHub Pages)

### Adım 1: GitHub Pages Ayarları
1. **GitHub Repository'ye git**: https://github.com/KULLANICI_ADI/agentPlaces
2. **Settings** sekmesine tıkla
3. **Pages** bölümüne git (sol menüde)
4. **Source** ayarları:
   - Source: "Deploy from a branch"
   - Branch: "gh-pages"
   - Folder: "/ (root)"
5. **Save** butonuna tıkla

### Adım 2: Manuel İlk Deploy
```powershell
cd frontend

# Dependencies kontrol
npm ci

# İlk deploy
npm run deploy
# "Published" mesajı görmeli
```

### Adım 3: GitHub Actions Kontrolü
1. **GitHub repository** → **Actions** sekmesi
2. **"Deploy Frontend to GitHub Pages"** workflow'unu gör
3. **Enable** et (eğer disabled ise)

### Adım 4: Erişim Testi
```powershell
# 2-3 dakika bekle, sonra test et
curl https://KULLANICI_ADI.github.io/agentPlaces
# HTML response almalısınız
```

**✅ Frontend URL**: https://KULLANICI_ADI.github.io/agentPlaces

---

## 🚀 Backend Deployment (Render)

### Adım 1: Render Blueprint Deploy
1. **Render Dashboard**: https://dashboard.render.com
2. **"New"** → **"Blueprint"** tıkla
3. **GitHub repository** seç: `agentPlaces`
4. **render.yaml detected** mesajını gör
5. **"Apply"** butonuna tıkla

### Adım 2: Service Yapılandırması
Render otomatik olarak şu servisleri oluşturacak:
- ✅ `agentplaces-backend` (Web Service)
- ✅ `agentplaces-worker` (Worker Service)  
- ✅ `agentplaces-redis` (Redis)
- ✅ `agentplaces-mongodb` (MongoDB - opsiyonel)

### Adım 3: Web Service Environment Variables
`agentplaces-backend` servisine git → **Environment** sekmesi:

```bash
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://agentplaces:ŞIFRE@agentplaces-cluster.xxxxx.mongodb.net/agentplaces?retryWrites=true&w=majority
REDIS_URL=[Render otomatik ayarlayacak]
JWT_SECRET=super-güvenli-jwt-secret-buraya-256-bit
CORS_ORIGIN=https://KULLANICI_ADI.github.io
OPENAI_API_KEY=sk-your-openai-key-here
GROQ_API_KEY=your-groq-key-here
```

### Adım 4: Worker Service Environment Variables
`agentplaces-worker` servisine git → **Environment** sekmesi:

```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://agentplaces:ŞIFRE@agentplaces-cluster.xxxxx.mongodb.net/agentplaces?retryWrites=true&w=majority
REDIS_URL=[Render otomatik ayarlayacak]
```

### Adım 5: Manuel Deploy Tetikleme
1. Her serviste **"Manual Deploy"** → **"Deploy latest commit"**
2. Logları takip et, hata kontrolü yap

---

## 🗄️ Database Setup

### MongoDB Atlas Konfigürasyonu

#### Adım 1: Connection String Al
1. **MongoDB Atlas Dashboard** → **Clusters**
2. **"Connect"** butonu → **"Connect your application"**
3. **Driver**: Node.js, **Version**: 4.1 or later
4. **Connection String** kopyala:
```
mongodb+srv://agentplaces:<password>@agentplaces-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

#### Adım 2: Database ve Collection Oluştur
```javascript
// MongoDB Compass veya Atlas UI kullanarak
Database adı: agentplaces
Collections:
- agents
- files  
- mail_threads
- queue_jobs
- users (opsiyonel)
```

#### Adım 3: Connection Test
```powershell
# Backend loglarında şunu görmelisiniz
# Render Dashboard → agentplaces-backend → Logs
"✅ MongoDB bağlantısı başarılı"
"🚀 AgentPlaces Backend is running on: https://agentplaces-backend-xxxx.onrender.com/api"
```

---

## 🔐 Environment Variables Detayları

### Frontend Environment Variables
```bash
# production için REACT_APP_ prefix gerekli
REACT_APP_API_URL=https://agentplaces-backend-xxxx.onrender.com
REACT_APP_NAME=AgentPlaces
REACT_APP_VERSION=1.0.0
```

### Backend Environment Variables - Zorunlu
```bash
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
REDIS_URL=redis://red-xxx.onrender.com:6379
JWT_SECRET=minimum-32-karakter-güvenli-secret
CORS_ORIGIN=https://username.github.io
```

### Backend Environment Variables - Opsiyonel
```bash
# LLM API Keys
OPENAI_API_KEY=sk-...
GROQ_API_KEY=gsk_...

# File Storage
STORAGE_PATH=./uploads
MAX_FILE_SIZE=10485760

# Email (opsiyonel)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com  
SMTP_PASS=your-app-password

# Logging
LOG_LEVEL=info

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 🌍 Domain ve SSL

### Custom Domain Setup (Opsiyonel)

#### GitHub Pages için Custom Domain
1. **Domain satın al** (örn: agentplaces.com)
2. **DNS ayarları**:
```
Type: CNAME
Name: www
Value: username.github.io
```
3. **GitHub Settings** → **Pages** → **Custom domain**: `www.agentplaces.com`
4. **Enforce HTTPS** checkbox'ını işaretle

#### Render için Custom Domain
1. **Render Dashboard** → **agentplaces-backend** → **Settings** → **Custom Domains**
2. **Add Custom Domain**: `api.agentplaces.com`
3. **DNS ayarları**:
```
Type: CNAME  
Name: api
Value: agentplaces-backend-xxxx.onrender.com
```

### SSL Sertifikaları
- ✅ **GitHub Pages**: Otomatik Let's Encrypt
- ✅ **Render**: Otomatik Let's Encrypt
- ✅ **MongoDB Atlas**: Built-in SSL

---

## 📊 Monitoring ve Maintenance

### Health Check URLs
```bash
# Frontend
https://username.github.io/agentPlaces

# Backend  
https://agentplaces-backend-xxxx.onrender.com/api/health

# Test API endpoints
https://agentplaces-backend-xxxx.onrender.com/api/agents
```

### Monitoring Dashboard
1. **Render Dashboard**: Service metrics, logs, deployment history
2. **GitHub Actions**: Deployment history, build logs
3. **MongoDB Atlas**: Database metrics, slow queries

### Log Monitoring
```bash
# Render logs (real-time)
# Dashboard → Service → Logs sekmesi

# GitHub Actions logs
# Repository → Actions → Workflow runs

# Frontend console logs
# Browser → Developer Tools → Console
```

### Performance Monitoring
```bash
# Frontend performance
# Lighthouse audit: https://pagespeed.web.dev/

# Backend performance  
# Response time test
curl -w "@curl-format.txt" -o /dev/null -s https://api-url.onrender.com/api/health
```

---

## 🔄 Update ve Maintenance

### Kod Güncellemeleri

#### Frontend Update
```powershell
# Kod değişikliği yap
git add .
git commit -m "Frontend güncelleme"
git push origin main
# GitHub Actions otomatik deploy eder

# Veya manuel
cd frontend
npm run deploy
```

#### Backend Update  
```powershell
# Kod değişikliği yap
git add .
git commit -m "Backend güncelleme"  
git push origin main
# Render otomatik deploy eder (2-5 dakika)
```

### Database Backup
```bash
# MongoDB Atlas otomatik backup (7 gün)
# Manual backup: Atlas Dashboard → Clusters → ... → Export Data
```

### Secret Rotation
```bash
# JWT Secret güncelleme
# Render Dashboard → Service → Environment → JWT_SECRET değiştir
# Manual Deploy tetikle

# Database password güncelleme
# Atlas → Database Access → Edit User → Generate New Password
# MONGODB_URI'yi güncelle
```

---

## 🐛 Troubleshooting

### Yaygın Sorunlar ve Çözümler

#### 1. Frontend Build Hatası
```powershell
# Hata: "Module not found"
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build

# Hata: "Out of memory"
$env:NODE_OPTIONS="--max_old_space_size=4096"
npm run build
```

#### 2. Backend Deployment Hatası
```bash
# Render logs kontrolü
# Dashboard → agentplaces-backend → Logs

# Yaygın hatalar:
# "MongoDB connection failed" → MONGODB_URI kontrol et
# "Redis connection failed" → REDIS_URL kontrol et
# "Port in use" → PORT environment variable kontrol et
```

#### 3. CORS Hataları
```typescript
// backend/src/config/configuration.ts
cors: {
  origin: [
    'https://username.github.io',
    'http://localhost:3009'  // development için
  ],
  credentials: true,
}
```

#### 4. Environment Variables Sorunları
```powershell
# Render Dashboard'da kontrol et
# Service → Environment sekmesi
# Required variables:
# - NODE_ENV=production  
# - MONGODB_URI=mongodb+srv://...
# - REDIS_URL=redis://...
# - JWT_SECRET=...
# - CORS_ORIGIN=https://...
```

#### 5. Database Connection Sorunları
```bash
# MongoDB Atlas Network Access kontrol et
# 0.0.0.0/0 IP range eklenmeli

# Connection string formatı kontrol et
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# Username/password doğru olmalı
# Özel karakterler URL encode edilmeli
```

### Emergency Rollback

#### Frontend Rollback
```powershell
# Önceki commit'e dön
git log --oneline -10  # commit hash'i bul
git checkout COMMIT_HASH -- frontend/
git add .
git commit -m "Frontend rollback to COMMIT_HASH"
git push origin main
```

#### Backend Rollback
```bash
# Render Dashboard → agentplaces-backend → Deploys
# Önceki deploy'dan "Redeploy" butonuna tıkla
```

### Support Contacts

#### Platform Support
- **GitHub Pages**: https://docs.github.com/pages
- **Render**: https://render.com/docs + Discord community
- **MongoDB Atlas**: https://www.mongodb.com/docs/atlas/

#### Debug Commands
```powershell
# Sistem durumu kontrol
curl https://username.github.io/agentPlaces  # Frontend
curl https://api-url.onrender.com/api/health  # Backend
nslookup username.github.io  # DNS kontrol
```

---

## ✅ Production Checklist

### Go-Live Öncesi
- [ ] Frontend build başarılı
- [ ] Backend build başarılı  
- [ ] Database connection test OK
- [ ] Environment variables set
- [ ] CORS ayarları doğru
- [ ] SSL sertifikaları aktif
- [ ] Health endpoints çalışıyor
- [ ] Error logging aktif

### Go-Live Sonrası
- [ ] Frontend erişilebilir
- [ ] Backend API responses OK
- [ ] Database operations çalışıyor
- [ ] File upload test OK
- [ ] Mail analysis test OK
- [ ] Queue system çalışıyor
- [ ] Performance acceptable
- [ ] Monitoring setup complete

### Güvenlik Checklist
- [ ] JWT secret güçlü ve unique
- [ ] Database password güçlü
- [ ] API keys secure environment'da
- [ ] CORS restrictive ayarlı
- [ ] Rate limiting aktif
- [ ] HTTPS everywhere
- [ ] No sensitive data in logs
- [ ] Regular backup strategy

---

## 🎯 Sonuç

Bu rehberi takip ederek AgentPlaces projenizi başarıyla production ortamında deploy edebilirsiniz:

🌐 **Frontend**: https://username.github.io/agentPlaces
🚀 **Backend**: https://agentplaces-backend-xxxx.onrender.com
📊 **Monitoring**: Render Dashboard + GitHub Actions

**Toplam süre**: ~30-45 dakika (ilk defa)
**Maliyet**: $0 (free tier'lar kullanarak)
**Ölçeklenebilirlik**: Render paid plans ile kolay upgrade

Good luck! 🚀
