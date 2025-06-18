# 🔧 AgentPlaces Deployment Troubleshooting

## 🚨 Yaygın Sorunlar ve Çözümler

### 1. Frontend Deployment Sorunları

#### ❌ GitHub Pages build hatası
```bash
# Hata: "Module not found" veya "Build failed"
Çözüm:
cd frontend
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
npm run build
npm run deploy
```

#### ❌ 404 Page Not Found
```bash
Kontrol Et:
1. GitHub Settings → Pages → Source = "gh-pages" branch
2. homepage field in package.json = "https://USERNAME.github.io/agentPlaces"
3. 2-3 dakika bekle (propagation time)
```

#### ❌ GitHub Actions workflow hatası
```yaml
# .github/workflows/deploy-frontend.yml kontrol et
- name: Setup Node.js
  uses: actions/setup-node@v3
  with:
    node-version: '18'  # 16 ise 18 yap
```

### 2. Backend Deployment Sorunları

#### ❌ Render build hatası
```bash
# Log'da "npm ERR!" görüyorsan
Çözüm:
1. backend/package.json scripts kontrol:
   "start:prod": "node dist/main"
   "start:worker": "node dist/worker"
2. Render Dashboard → Manual Deploy
```

#### ❌ "Application failed to start"
```bash
Kontrol Et:
1. Environment Variables:
   - NODE_ENV=production ✅
   - PORT=3000 ✅
   - MONGODB_URI başlangıç ✅
2. Health endpoint: /api/health
```

#### ❌ Worker servisi çalışmıyor
```bash
Kontrol Et:
1. backend/src/worker.ts dosyası mevcut
2. package.json → "start:worker": "node dist/worker"
3. Environment variables worker servisinde set
```

### 3. Database Sorunları

#### ❌ MongoDB connection failed
```bash
# Error: "MongoNetworkError" veya "Authentication failed"
Çözüm:
1. MongoDB Atlas → Network Access → 0.0.0.0/0 var mı?
2. Database Access → User var mı? Password doğru mu?
3. Connection string format:
   mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true&w=majority
```

#### ❌ Database authentication hatası
```bash
Çözüm:
1. MongoDB Atlas → Database Access
2. User listesinde "agentplaces" var mı?
3. Password reset → Yeni password
4. MONGODB_URI güncelle
```

#### ❌ Redis connection hatası
```bash
# Error: "Redis connection refused"
Kontrol Et:
1. Render → agentplaces-redis servisi çalışıyor mu?
2. REDIS_URL environment variable set mi?
3. BullModule configuration backend'de doğru mu?
```

### 4. CORS ve API Sorunları

#### ❌ "CORS policy" hatası
```typescript
// backend/src/config/configuration.ts
cors: {
  origin: [
    'https://USERNAME.github.io',  // Production
    'http://localhost:3009'        // Development  
  ],
  credentials: true,
}
```

#### ❌ API calls 404 dönüyor
```javascript
// frontend/src/config/api.js kontrol et
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:2809';

// Environment variable set etmeyi unutma:
// REACT_APP_API_URL=https://agentplaces-backend-XXXX.onrender.com
```

#### ❌ "Network Error" frontend'de
```bash
Kontrol Et:
1. Backend servisi UP mu? (Render Dashboard)
2. Health endpoint test: curl https://backend-url.onrender.com/api/health
3. CORS ayarları doğru mu?
4. API URL'de /api prefix var mı?
```

### 5. Environment Variables Sorunları

#### ❌ Eksik environment variables
```bash
# Backend required variables checklist:
NODE_ENV=production           ✅
PORT=3000                     ✅
MONGODB_URI=mongodb+srv://... ✅
REDIS_URL=redis://...         ✅ (Render otomatik)
JWT_SECRET=32+chars           ✅
CORS_ORIGIN=https://...       ✅

# Frontend required variables:
REACT_APP_API_URL=https://... ✅
```

#### ❌ Environment variables okumuyor
```bash
Render'da kontrol et:
1. Service → Environment sekmesi
2. Variables kaydedilmiş mi?
3. Manual Deploy tetikle
4. Logs'da variables görünüyor mu?
```

### 6. SSL ve Domain Sorunları

#### ❌ "Mixed content" hatası
```bash
# HTTP → HTTPS sorun
Çözüm:
1. Tüm API calls https:// kullanmalı
2. frontend/src/config/api.js → https://backend-url
3. No http:// references anywhere
```

#### ❌ Custom domain çalışmıyor
```bash
DNS Kontrol:
1. CNAME record doğru mu?
   - GitHub Pages: USERNAME.github.io
   - Render: backend-service.onrender.com
2. TTL 300 saniye (5 dakika) bekle
3. nslookup domain.com test et
```

---

## 🔍 Debug Commands

### Health Check Commands
```powershell
# Frontend accessibility
curl https://USERNAME.github.io/agentPlaces

# Backend health  
curl https://backend-url.onrender.com/api/health

# API endpoints
curl https://backend-url.onrender.com/api/agents

# DNS resolution
nslookup USERNAME.github.io
nslookup backend-url.onrender.com
```

### Log Analysis
```bash
# GitHub Actions logs
# Repository → Actions → Latest workflow → Build logs

# Render service logs  
# Dashboard → Service → Logs tab → Real-time

# Browser console logs
# F12 → Console tab → Network tab
```

### Performance Testing
```powershell
# Response time test
Measure-Command { curl https://backend-url.onrender.com/api/health }

# Load testing (basic)
for ($i=1; $i -le 10; $i++) { 
  curl https://backend-url.onrender.com/api/health 
}
```

---

## 🆘 Emergency Procedures

### Complete System Down

#### 1. Quick Status Check
```powershell
# Frontend
curl -I https://USERNAME.github.io/agentPlaces
# Status: 200 OK bekleniyor

# Backend
curl -I https://backend-url.onrender.com/api/health  
# Status: 200 OK bekleniyor

# Database
# Render Dashboard → agentplaces-mongodb → Status
# MongoDB Atlas → Clusters → Status
```

#### 2. Service Restart
```bash
# Frontend: GitHub Pages (otomatik)
# Backend: Render Dashboard → Service → Manual Deploy

# Database: Genelde restart gerekmez
# Redis: Render Dashboard → Redis service → Restart
```

#### 3. Rollback Procedure
```powershell
# Frontend rollback
git log --oneline -5
git checkout GOOD_COMMIT_HASH -- frontend/
git add .
git commit -m "Emergency rollback frontend"
git push origin main

# Backend rollback  
# Render Dashboard → Service → Deploys → Previous deploy → Redeploy
```

### Partial Service Down

#### Frontend up, Backend down
```bash
1. Render Dashboard → agentplaces-backend → Logs check
2. Environment variables check
3. Manual Deploy
4. If still down → Previous deploy rollback
```

#### Backend up, Database down
```bash
1. MongoDB Atlas Dashboard → Cluster status
2. Network Access → 0.0.0.0/0 check
3. Database Access → User check
4. Connection string test
```

---

## 📞 Support Escalation

### Platform-Specific Support

#### GitHub Issues
- Actions failing: https://github.com/actions
- Pages not loading: https://www.githubstatus.com

#### Render Issues  
- Service down: https://status.render.com
- Support: Discord community
- Docs: https://render.com/docs

#### MongoDB Atlas Issues
- Cluster issues: https://status.mongodb.com  
- Support: Atlas UI → Support → Create case
- Community: https://community.mongodb.com

### Self-Service Recovery

#### 1. Monitoring Setup
```javascript
// Simple uptime monitoring
setInterval(() => {
  fetch('https://backend-url.onrender.com/api/health')
    .then(r => console.log('✅ Backend UP'))
    .catch(e => console.log('❌ Backend DOWN'));
}, 60000); // Her dakika
```

#### 2. Automated Health Checks
```yaml
# .github/workflows/health-check.yml
name: Health Check
on:
  schedule:
    - cron: '*/10 * * * *'  # Her 10 dakika
jobs:
  health:
    runs-on: ubuntu-latest
    steps:
      - name: Frontend Check
        run: curl -f https://USERNAME.github.io/agentPlaces
      - name: Backend Check  
        run: curl -f https://backend-url.onrender.com/api/health
```

---

## 📊 Error Code Reference

| Code | Service | Issue | Solution |
|------|---------|-------|----------|
| 404 | Frontend | GitHub Pages not found | Pages settings check |
| 502 | Backend | Service unavailable | Render service restart |
| 503 | Backend | Service starting | Wait 2-3 minutes |
| CORS | API | Cross-origin blocked | CORS config check |
| ENOTFOUND | DNS | Domain not resolved | DNS propagation wait |
| ETIMEDOUT | Network | Connection timeout | Service status check |

Bu troubleshooting rehberi ile çoğu deployment sorununu kendi başınıza çözebilirsiniz! 🔧
