# AgentPlaces - Ölçeklenebilir Agent Yönetim Platformu

## 👋 Merhaba! Hoş Geldiniz!

**AgentPlaces**'e hoş geldiniz! Bu platform, kişisel agent yönetimi için ölçeklenebilir bir geliştirme workspace'idir.

## 🎯 Proje Hakkında

AgentPlaces, kişisel agent yönetimi için ölçeklenebilir bir platform geliştirme workspace'idir. Modüler mimari ve mikro-servis yaklaşımı ile geliştirilmektedir.

### 🚀 Türkçe Karşılama
Bu proje tamamen Türkçe destekli olarak geliştirilmiştir. Tüm arayüz metinleri, API yanıtları ve dokümantasyon Türkçe olarak hazırlanmıştır.

**Merhaba dediğinizde size şu özellikleri sunuyoruz:**
- ✅ Tam Türkçe kullanıcı arayüzü
- ✅ Türkçe API yanıtları ve hata mesajları
- ✅ Türkçe agent prompt şablonları
- ✅ Kapsamlı Türkçe dokümantasyon
- ✅ Turkish-friendly variable naming

### 🔧 Teknoloji Stack
- **Backend**: NestJS (Port: 2809)
- **Frontend**: React + TypeScript (Port: 3009) 
- **Database**: MongoDB (Port: 27017)
- **Cache & Queue**: Redis (Port: 6379)
- **File Storage**: MinIO (Port: 9000)
- **Mail Testing**: MailHog (Port: 8025)

### 🚀 Hızlı Başlangıç

#### 1. Servisleri Başlatın
```powershell
# Otomatik restart (Önerilen)
.\restart.ps1

# Manuel başlatma
docker-compose up -d
cd backend && npm run start:dev
cd frontend && npm start
```

#### 2. Erişim URL'leri
- **Frontend**: http://localhost:3009
- **Backend API**: http://localhost:2809/api
- **Health Check**: http://localhost:2809/api/health

## 📋 GitHub Copilot İçin Geliştirme Talimatları

### 🎯 Ana Geliştirme Prompt'u

Bu AgentPlaces projesini geliştirirken aşağıdaki talimatları takip edin:

**🏗️ Referans Dosyalar:**
1. **`.github/copilot-instructions.md`** - Detaylı geliştirme talimatları
2. **`PROJECT-STATUS.md`** - Güncel proje durumu
3. **`SPRINT-3-PLAN.md`** - Aktif sprint hedefleri
4. **`agentPlacesSunum/`** - Proje mimarisi ve tasarım
5. **`firstTalk/`** - İlk gereksinim analizi

**🎯 Geliştirme Hedefleri:**
- Modüler ve ölçeklenebilir mimari
- Agent CRUD işlemleri
- Mail analiz sistemi
- Dosya işleme modülleri  
- LLM entegrasyonu
- Queue-based task processing

**📋 Sprint Görevleri:**
- [x] Backend NestJS yapısı ✅
- [x] MongoDB + Redis + BullMQ entegrasyonu ✅
- [x] Agent CRUD API'leri ✅
- [x] React temel arayüz ✅
- [ ] PDF upload ve özetleme özelliği
- [ ] Mail-Analyst agent prototipi
- [ ] Advanced UI components

### 🤖 Agent Engine Tasarımı

```typescript
interface AgentConfig {
  id: string;
  name: string;
  capabilities: string[];
  promptTemplate: string;
  llmProvider: 'openai' | 'local' | 'groq';
  resources: ResourceConfig;
}

interface ScalableAgent {
  process(input: AgentInput): Promise<AgentOutput>;
  scale(instances: number): Promise<void>;
  getMetrics(): AgentMetrics;
}
```

**Temel Modüller:**
- **agents/**: Agent CRUD ve yönetim
- **file-processing/**: Dosya upload ve analiz 
- **mail-analysis/**: Email thread analizi
- **queue-manager/**: Task kuyruğu yönetimi
- **llm-integration/**: LLM servis adaptörleri

## 📁 Repository Dosya Yapısı ve Amaçları

Bu repository'de bulunan dosyalar, yeni bir proje başlangıcı için kalıp ve kapsam belirleyici dokümanlar olarak tasarlanmıştır:

### 🎨 Proje Kalıp Dosyaları:

#### 1. `agentPlacesSunum`
- **Amaç**: Proje mimarisinin PowerPoint sunumu
- **İçerik**: Modüler yapı, teknoloji stack'i, sprint planları
- **Kullanım**: Geliştirme roadmap'i ve mimari kararlar için referans

#### 2. `firstTalk`
- **Amaç**: Projenin gereksinim analizi ve ChatGPT ile yapılan ilk görüşme
- **İçerik**: Mail loop analizi, agent yetenekleri, Türkçe destek gereksinimleri
- **Kullanım**: İş gereksinimleri ve fonksiyonel spesifikasyonlar için referans

#### 3. `.github/copilot-instructions.md`
- **Amaç**: GitHub Copilot için özelleştirilmiş geliştirme talimatları
- **İçerik**: Ölçeklenebilir mimari prensipleri, kodlama standartları, modüler yapı kuralları
- **Kullanım**: Copilot Agent'ın projeyi doğru yaklaşımla geliştirmesi için yönlendirme

#### 4. `README.md` (Bu dosya)
- **Amaç**: Proje tanıtımı ve Copilot Agent için ana prompt
- **İçerik**: Geliştirme prompt'u, dosya açıklamaları, başlangıç rehberi
- **Kullanım**: Projeye yeni başlayanlar ve Copilot Agent için giriş noktası

## 🏗️ Ölçeklenebilir Yapı Kurgusu

Bu proje özellikle **ölçeklenebilir yapı** odaklı olarak tasarlanmıştır:

### 🎯 Neden Ölçeklenebilirlik?
- **Modüler Büyüme**: Her yeni agent türü mevcut yapıyı bozmadan eklenebilir
- **Performans Optimizasyonu**: Yük arttıkça horizontal scaling mümkün
- **Bakım Kolaylığı**: Her modül bağımsız olarak güncellenebilir
- **Maliyet Optimizasyonu**: Sadece gerekli modüller çalıştırılabilir

### 🔧 Teknik Yaklaşım:
- **Mikroservis Mimarisi**: Her modül ayrı container'da çalışabilir
- **Event-Driven Communication**: Modüller arası gevşek bağlantı
- **Plugin Architecture**: Yeni özellikler runtime'da eklenebilir
- **Distributed Caching**: Redis cluster ile ölçeklenebilir cache
- **Queue-Based Processing**: BullMQ ile paralel işlem kapasitesi

## 🚀 Başlangıç Rehberi

### Önkoşullar:
- Node.js 18+
- MongoDB
- Redis
- Docker (opsiyonel)

### Geliştirme Adımları:
1. **Repository'yi klonlayın**
2. **Yukarıdaki prompt'u GitHub Copilot Agent'a verin**
3. **`.github/copilot-instructions.md` dosyasını inceleyin**
4. **Sprint 1 görevleriyle başlayın**
5. **Modüler yapıyı koruyarak geliştirin**

## 📊 Proje Durumu (Güncel)

### ✅ Tamamlanan Özellikler
- [x] **Backend NestJS** - Port 2809'da çalışıyor ✅
- [x] **Frontend React** - Port 3009'da çalışıyor ✅  
- [x] **MongoDB Integration** - Database bağlantısı aktif ✅
- [x] **Redis & BullMQ** - Queue sistemi çalışıyor ✅
- [x] **Docker Services** - Tüm servisler containerized ✅
- [x] **Agent CRUD API** - Temel işlemler hazır ✅
- [x] **File Upload System** - Dosya yükleme aktif ✅
- [x] **Mail Analysis Module** - Mail işleme modülü ✅
- [x] **Queue Management** - Task kuyruğu yönetimi ✅

### 🚧 Devam Eden Çalışmalar
- [ ] **PDF Processing** - Dosya özetleme özellikleri
- [ ] **Advanced UI** - Gelişmiş kullanıcı arayüzü
- [ ] **LLM Integration** - OpenAI/Local LLM entegrasyonu
- [ ] **Authentication** - Kullanıcı kimlik doğrulama
- [ ] **Performance Monitoring** - Sistem metrikleri

## 🌐 Production Deployment

### Live Demo
- **Frontend**: https://kaplayan-atakan.github.io/agentPlaces
- **Backend API**: https://agentplaces-backend.onrender.com

### Deployment Strategy
- **Frontend**: GitHub Pages (otomatik deploy)
- **Backend**: Render (web service + worker)
- **Database**: MongoDB (Render/Atlas)
- **Cache**: Redis (Render)

### Quick Deploy
```bash
# Frontend deploy
cd frontend
npm run deploy

# Backend deploy (otomatik)
git push origin main
```

📋 Detaylı deployment rehberi için: [`DEPLOYMENT-GUIDE.md`](./DEPLOYMENT-GUIDE.md)

## 📚 Deployment Dokümantasyonu

### 🚀 Production Deploy Rehberleri
- **[⚡ QUICK-DEPLOYMENT.md](./QUICK-DEPLOYMENT.md)** - Copy-paste komutlarla hızlı deployment
- **[🎯 FIRST-DEPLOYMENT.md](./FIRST-DEPLOYMENT.md)** - İlk deployment için detaylı adım adım rehber
- **[� DEPLOYMENT-STATUS.md](./DEPLOYMENT-STATUS.md)** - Mevcut proje durumu ve hazırlık analizi
- **[�📋 DEPLOYMENT-CHECKLIST.md](./DEPLOYMENT-CHECKLIST.md)** - 30 dakikada hızlı deployment checklist
- **[📖 PRODUCTION-DEPLOYMENT.md](./PRODUCTION-DEPLOYMENT.md)** - En detaylı step-by-step rehber
- **[🔧 TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Sorun çözme kılavuzu
- **[📋 DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md)** - Genel deployment stratejisi

### ⚡ Hızlı Başlangıç
```bash
# İlk kez deploy ediyorsanız
# FIRST-DEPLOYMENT.md dosyasını takip edin (30 dakika)

# Hızlı deploy için  
# QUICK-DEPLOYMENT.md dosyasındaki komutları kullanın

# Test
curl https://kaplayan-atakan.github.io/agentPlaces
curl https://backend-url.onrender.com/api/health
```

## 🔗 Faydalı Linkler

### 📚 Dokümantasyon
- [Proje Durumu](PROJECT-STATUS.md) - Güncel durum raporu
- [Sprint 3 Planı](SPRINT-3-PLAN.md) - Aktif sprint hedefleri
- [Design System](DESIGN-SYSTEM.md) - UI/UX tasarım sistemi
- [Sprint 2 Raporu](SPRINT-2-FINAL-REPORT.md) - Önceki sprint özeti

### 🧪 Test Dosyaları
- `test-agent.json` - Agent test verisi
- `test-mail.json` - Mail analiz test verisi  
- `test-queue-task.json` - Queue task test verisi
- `test-response.json` - API response örnekleri

### 🎥 Sunum ve Demo
- `agentPlacesSunum/` - Proje mimarisi sunumu
- `project-presentation.html` - Web tabanlı sunum

## 🤝 Katkıda Bulunma

Bu proje ölçeklenebilir yapı odaklı geliştirme için bir template olarak tasarlanmıştır. 

### 📋 Geliştirme Kuralları
1. **Modüler Yaklaşım**: Her özellik bağımsız modül olarak geliştirin
2. **Test Coverage**: Minimum %80 test coverage hedefleyin
3. **Documentation**: Türkçe yorum ve dokümantasyon ekleyin
4. **Code Quality**: ESLint ve Prettier kurallarına uyun
5. **Git Workflow**: Meaningful commit messages kullanın

### 🚀 Öncelikli Görevler
- PDF parsing ve özetleme sistemi
- Advanced React UI components
- LLM integration layer
- Performance monitoring dashboard
- Authentication & authorization

## 📞 İletişim ve Destek

### 📧 Teknik Destek
- **Backend Issues**: NestJS, MongoDB, Redis sorunları
- **Frontend Issues**: React, TypeScript, UI/UX sorunları  
- **DevOps Issues**: Docker, deployment, scaling sorunları

### 📖 Referans Kaynaklar
- [NestJS Documentation](https://docs.nestjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [BullMQ Documentation](https://docs.bullmq.io/)

## 📄 Lisans

Bu proje açık kaynak kodludur ve MIT lisansı altında paylaşılmaktadır.

---

**🎯 Not**: Bu repository'deki tüm dosyalar, benzer ölçeklenebilir projeler için kalıp olarak kullanılabilir. Özellikle `.github/copilot-instructions.md` dosyası, diğer projelerinizde de GitHub Copilot'un doğru yaklaşımla çalışması için adapte edilebilir.