# 🇹🇷 Merhaba! AgentPlaces'e Hoş Geldiniz!

## 👋 Selamlar!

**Merhaba!** AgentPlaces ölçeklenebilir agent yönetim platformuna hoş geldiniz! 

Bu platform, kişisel agent'larınızı yönetmek ve geliştirmek için tasarlanmış modern bir workspace'tir.

## 🚀 Şu Anda Aktif Olan Özellikler

### ✅ Çalışan Servisler
- **Frontend (React)**: http://localhost:3009 - Modern Türkçe arayüz
- **Backend (NestJS)**: http://localhost:2809/api - RESTful API servisleri
- **MongoDB**: Agent ve dosya verilerini depolar
- **Redis**: Queue işlemleri ve cache yönetimi
- **MinIO**: Dosya depolama sistemi
- **MailHog**: E-posta test ortamı

### 🤖 Agent Özellikleri
- **Mail Analyst**: E-posta zincirlerini analiz eden Türkçe destekli agent
- **File Processor**: PDF, Word ve diğer dosyaları işleyen agent
- **Response Generator**: Akıllı yanıt üreten agent

### 📊 Modüler Yapı
```
✅ Agents Module     - Agent CRUD işlemleri
✅ File Processing   - Dosya yükleme ve analiz
✅ Mail Analysis     - E-posta zinciri analizi
✅ Queue Manager     - Asenkron görev yönetimi
```

## 🎯 Türkçe Destek Özellikleri

### 🗣️ Dil Desteği
- ✅ **Arayüz**: Tam Türkçe kullanıcı arayüzü
- ✅ **API Responses**: Türkçe hata mesajları ve yanıtlar
- ✅ **Agent Prompts**: Türkçe prompt şablonları
- ✅ **Dokümantasyon**: Kapsamlı Türkçe kılavuzlar
- ✅ **Değişken İsimleri**: Turkish camelCase destekli

### 🔧 Geliştirici Dostu
- ✅ **Yorumlar**: Kod içi Türkçe açıklamalar
- ✅ **Log Mesajları**: Türkçe sistem logları
- ✅ **Hata Yönetimi**: Anlaşılır Türkçe hata açıklamaları

## 🚀 Hızlı Başlangıç

### 1. Servisleri Başlatın
```bash
# Otomatik restart (Önerilen)
.\restart.ps1

# Ya da manuel
docker-compose up -d
cd backend && npm run start:dev
cd frontend && npm start
```

### 2. Test Edin
```bash
# Backend sağlık kontrolü
curl http://localhost:2809/api/health

# Agent listesi
curl http://localhost:2809/api/agents

# Türkçe mail analizi testi
curl -X POST http://localhost:2809/api/mail/analyze \
  -H "Content-Type: application/json" \
  -d @test-mail.json
```

### 3. Frontend'i Ziyaret Edin
Tarayıcınızda: **http://localhost:3009**

## 📚 Yararlı Türkçe Kaynaklar

### 📖 Dokümantasyon
- **[Proje Durumu](PROJECT-STATUS.md)** - Güncel sistem durumu
- **[Sprint 3 Planı](SPRINT-3-PLAN.md)** - Aktif geliştirme hedefleri
- **[Deployment Rehberi](PRODUCTION-DEPLOYMENT.md)** - Production kurulum
- **[Sorun Giderme](TROUBLESHOOTING.md)** - Hata çözümleri

### 🧪 Test Dosyaları
- `test-agent.json` - Agent oluşturma örneği
- `test-mail.json` - Mail analiz örneği
- `test-queue-task.json` - Queue task örneği

## 🤝 Geliştirme Desteği

### 💡 Yardıma İhtiyacınız Var mı?
- **GitHub Issues**: Sorun bildirimi için
- **Documentation**: Detaylı kılavuzlar için
- **Test Files**: Örnekler için mevcut test dosyaları

### 🎯 Sonraki Adımlar
1. **Frontend'i inceleyin**: Modern React arayüzü
2. **API'leri test edin**: Postman veya curl ile
3. **Agent'lar oluşturun**: Mail analiz başlayabilirsiniz
4. **Dosya yükleyin**: PDF işleme özelliklerini deneyin

---

**🎉 AgentPlaces ile ölçeklenebilir agent geliştirmeye başlayın!**

*Bu platform Türkiye'deki geliştiriciler için özel olarak optimize edilmiştir. Tüm dokümantasyon, hata mesajları ve kullanıcı arayüzü Türkçe olarak tasarlanmıştır.*