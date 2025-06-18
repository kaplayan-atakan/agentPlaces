# 🚀 AgentPlaces Deployment Rehberi

Bu dokümantasyon, AgentPlaces projesinin GitHub Pages (frontend) ve Render (backend) üzerinde nasıl deploy edileceğini açıklar.

## 📋 Ön Koşullar

### Gerekli Hesaplar
- GitHub hesabı (GitHub Pages için)
- Render hesabı (https://render.com)
- MongoDB Atlas hesabı (ücretsiz tier mevcut)

### Yerel Geliştirme Ortamı
- Node.js 18+ 
- npm veya yarn
- Git

## 🏗️ Deployment Stratejisi

### Frontend: GitHub Pages
- **URL**: https://kaplayan-atakan.github.io/agentPlaces
- **Otomatik Deploy**: GitHub Actions ile
- **Build**: React production build
- **CDN**: GitHub Pages built-in CDN

### Backend: Render
- **Web Service**: NestJS API server
- **Worker Service**: Background job processor
- **Database**: MongoDB (Render veya Atlas)
- **Cache**: Redis (Render)

## 🎯 Frontend Deployment (GitHub Pages)

### 1. Otomatik Deployment
GitHub Actions workflow zaten yapılandırılmış:
```bash
# Her main branch push'unda otomatik deploy
git push origin main
```

### 2. Manuel Deployment
```bash
cd frontend
npm run build
npm run deploy
```

### 3. GitHub Pages Ayarları
1. GitHub repository → Settings → Pages
2. Source: Deploy from a branch
3. Branch: gh-pages
4. Folder: / (root)

## 🚀 Backend Deployment (Render)

### 1. Render Blueprint Deployment
1. Render dashboard'a git
2. "New" → "Blueprint"
3. GitHub repository'yi bağla
4. render.yaml otomatik detect edilecek
5. Environment variables'ı ayarla

### 2. Gerekli Environment Variables

#### Web Service Environment Variables
```
NODE_ENV=production
PORT=3000
MONGODB_URI=<MongoDB connection string>
REDIS_URL=<Redis connection string>
JWT_SECRET=<güvenli-jwt-secret>
CORS_ORIGIN=https://kaplayan-atakan.github.io
OPENAI_API_KEY=<your-openai-key>
GROQ_API_KEY=<your-groq-key>
```

#### Worker Service Environment Variables
```
NODE_ENV=production
MONGODB_URI=<MongoDB connection string>
REDIS_URL=<Redis connection string>
```

### 3. Database Setup (MongoDB)

#### Option A: Render Database
```yaml
# render.yaml içinde tanımlı
databases:
  - name: agentplaces-mongodb
    type: mongodb
```

#### Option B: MongoDB Atlas
1. MongoDB Atlas'ta cluster oluştur
2. Database user oluştur
3. Network access'i yapılandır (0.0.0.0/0)
4. Connection string'i kopyala

### 4. Redis Setup
```yaml
# render.yaml içinde tanımlı
services:
  - type: redis
    name: agentplaces-redis
```

## 🔧 Configuration Files

### Frontend API Configuration
```javascript
// frontend/src/config/api.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:2809';
```

### Backend Configuration
```typescript
// backend/src/config/configuration.ts
export default () => ({
  port: parseInt(process.env.PORT, 10) || 2809,
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/agentplaces',
  },
  // ... diğer config'ler
});
```

## 📝 Deployment Adımları

### İlk Deployment

1. **Repository Hazırla**
```bash
git add .
git commit -m "Production deployment setup"
git push origin main
```

2. **Frontend Deploy**
```bash
cd frontend
npm run deploy
```

3. **Backend Deploy**
- Render'a git
- Blueprint'i import et
- Environment variables'ı ayarla
- Deploy et

### Güncellemeler

1. **Frontend Güncellemeleri**
```bash
# Kod değişikliği yap
git push origin main  # Otomatik deploy

# veya manuel
cd frontend
npm run deploy
```

2. **Backend Güncellemeleri**
```bash
# Kod değişikliği yap
git push origin main  # Render otomatik deploy eder
```

## 🔍 Deployment Verification

### Frontend Test
```bash
# Sitenin açılması
curl https://kaplayan-atakan.github.io/agentPlaces

# React router çalışması
# Browser'da https://kaplayan-atakan.github.io/agentPlaces/enterprise
```

### Backend Test
```bash
# Health check
curl https://your-render-url.onrender.com/api/health

# API endpoints
curl https://your-render-url.onrender.com/api/agents
```

### Integration Test
```bash
# Frontend → Backend communication
# Browser developer console'da network tab'ını kontrol et
```

## 🐛 Troubleshooting

### Common Issues

#### 1. CORS Errors
```typescript
// backend/src/config/configuration.ts
cors: {
  origin: 'https://kaplayan-atakan.github.io',
  credentials: true,
}
```

#### 2. Environment Variables
```bash
# Render dashboard'da environment variables'ı kontrol et
# .env.example dosyalarını referans al
```

#### 3. Build Errors
```bash
# Frontend
cd frontend
npm run build

# Backend  
cd backend
npm run build
```

#### 4. Database Connection
```javascript
// MongoDB connection string format
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

## 🔒 Security Checklist

- [ ] JWT secret güçlü ve unique
- [ ] Database password güçlü
- [ ] API keys güvenli environment variables'da
- [ ] CORS doğru yapılandırılmış
- [ ] Rate limiting aktif
- [ ] HTTPS kullanımı (Render otomatik)

## 📊 Monitoring

### Health Checks
- Frontend: https://kaplayan-atakan.github.io/agentPlaces
- Backend: https://your-render-url.onrender.com/api/health

### Logs
- Frontend: Browser developer console
- Backend: Render dashboard logs

### Performance
- Frontend: Lighthouse scores
- Backend: Render metrics

## 🆘 Support

### Documentation
- React: https://reactjs.org/docs
- NestJS: https://docs.nestjs.com
- Render: https://render.com/docs

### Deployment Issues
1. GitHub Actions logs kontrol et
2. Render service logs kontrol et
3. Environment variables kontrol et
4. Network connectivity test et

Bu rehber ile AgentPlaces projesi başarıyla production ortamında çalıştırılabilir.
