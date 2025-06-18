# ⚡ AgentPlaces Deployment Quick Start

## 🚀 Hızlı Deployment (30 Dakika)

### 📋 Ön Hazırlık (5 dakika)
```powershell
# 1. Repository kontrolü
cd c:\aaa\agentPlaces
git status
git push origin main

# 2. Build test
cd frontend && npm ci && npm run build
cd ..\backend && npm ci && npm run build
```

### 🌐 Frontend Deploy (10 dakika)

#### GitHub Pages Ayarları
1. https://github.com/USERNAME/agentPlaces → **Settings** → **Pages**
2. Source: "Deploy from a branch" → Branch: "gh-pages" → **Save**

#### Deploy
```powershell
cd frontend
npm run deploy
# ✅ "Published" mesajını bekle
```

**✅ URL**: https://USERNAME.github.io/agentPlaces

### 🗄️ Database Setup (5 dakika)

#### MongoDB Atlas
1. https://www.mongodb.com/atlas → **Create Free Cluster**
2. Region: **Virginia (us-east-1)**
3. **Database Access** → Add User: `agentplaces` / güçlü şifre
4. **Network Access** → Add IP: `0.0.0.0/0`
5. **Connect** → Copy connection string

### 🚀 Backend Deploy (10 dakika)

#### Render Blueprint
1. https://dashboard.render.com → **New** → **Blueprint**
2. Repository: **agentPlaces** → **Apply**

#### Environment Variables
`agentplaces-backend` servisi → **Environment**:
```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://agentplaces:PASSWORD@cluster.mongodb.net/agentplaces
JWT_SECRET=en-az-32-karakter-güvenli-secret
CORS_ORIGIN=https://USERNAME.github.io
```

`agentplaces-worker` servisi → **Environment**:
```bash
NODE_ENV=production  
MONGODB_URI=mongodb+srv://agentplaces:PASSWORD@cluster.mongodb.net/agentplaces
```

**✅ URL**: https://agentplaces-backend-XXXX.onrender.com

---

## ✅ Test Checklist

```powershell
# Frontend test
curl https://USERNAME.github.io/agentPlaces

# Backend test  
curl https://agentplaces-backend-XXXX.onrender.com/api/health

# Integration test
# Browser → https://USERNAME.github.io/agentPlaces → Network tab kontrol
```

---

## 🔧 Güncelleme

```powershell
# Her güncellemede
git add .
git commit -m "Güncelleme açıklaması"
git push origin main
# ✅ Otomatik deploy: GitHub Actions + Render
```

---

## 🆘 Sorun Çözme

### Frontend çalışmıyor
- GitHub → Actions → Build logs kontrol
- Browser console errors kontrol

### Backend çalışmıyor  
- Render Dashboard → Logs kontrol
- Environment variables kontrol

### Database bağlantı sorunu
- MongoDB Atlas → Network Access kontrol (0.0.0.0/0)
- Connection string format kontrol

---

## 📊 Production URLs

| Servis | URL | Status |
|--------|-----|---------|
| Frontend | https://USERNAME.github.io/agentPlaces | ✅ |
| Backend API | https://agentplaces-backend-XXXX.onrender.com | ✅ |
| Health Check | https://agentplaces-backend-XXXX.onrender.com/api/health | ✅ |
| MongoDB | Atlas Cluster | ✅ |
| Redis | Render Redis | ✅ |

**🎯 Toplam Süre**: ~30 dakika
**💰 Maliyet**: $0 (free tiers)

Detaylı rehber için: [`PRODUCTION-DEPLOYMENT.md`](./PRODUCTION-DEPLOYMENT.md)
