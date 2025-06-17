# AgentPlaces - Ölçeklenebilir Agent Yönetim Platformu

## 🎯 GitHub Copilot Agent İçin Geliştirme Prompt'u

Bu proje, kişisel agent yönetimi için ölçeklenebilir bir platform geliştirme amacıyla oluşturulmuştur. Aşağıdaki prompt'u GitHub Copilot Agent'a vererek projeyi geliştirmenizi öneriyorum:

### 📋 Ana Geliştirme Prompt'u:

Bu AgentPlaces projesini geliştirirken aşağıdaki dosyaları ve bilgileri referans alarak çalış:

Proje Genel Bakışı:
Proje Adı: AgentPlaces - Kişisel Agent Yönetim Platformu
Teknoloji Stack: Node.js (NestJS), React, TypeScript, MongoDB, Redis, BullMQ
Mimari: Modüler ve mikro-servis odaklı yapı
Hedef: Mail analizi, dosya yorumlama ve özel agent'lar için merkezi yönetim platformu
Mevcut Dosyalardan Referans Al:
agentPlacesSunum dosyasından:

Sunumdaki mimari yapıyı takip et
Modüler yapı ve mikro parçacıklar bölümündeki approach'ı uygula
Sprint 1 planındaki görevleri öncelikle
Teknoloji stack'ini tam olarak kullan
firstTalk dosyasından:

Mail loop analizi için gereksinimler
Agent'ın sorular sorup, dosya alıp yorumlama yeteneği
Türkçe dil desteği
Profesyonel iletişim ton'u
.github/copilot-instructions.md dosyasından:

Ölçeklenebilir mimari prensipleri
Modüler yapı standartları
Performans ve monitoring odaklı geliştirme
Mikroservis hazır yapı
Geliştirilecek Ana Modüller:
Backend (NestJS):

Agent CRUD API'leri
Dosya upload ve parsing servisleri
Mail loop analiz engine
Queue management (BullMQ)
MongoDB ve Redis entegrasyonu
Frontend (React):

Agent yönetim dashboard'u
Dosya yükleme arayüzü
Mail thread görüntüleme
Agent yanıtlarını izleme paneli
Agent Core Engine:

Prompt template sistemi
LLM entegrasyon katmanı (OpenAI/Local)
Dosya yorumlayıcılar (PDF, DOCX, Email)
Task executors (analyzeMailLoop, summarizeFile, generateReply)
Ölçeklenebilirlik Odaklı Geliştirme:
Mikro-seviye modüler parçacıklar
Horizontal scaling hazır yapı
Container-ready architecture
Plugin sistemi desteği
Event-driven communication
Distributed caching strategy
İlk Sprint Görevleri (Öncelik Sırası):
NestJS backend yapısını kur (Modüler mimari ile)
MongoDB + Redis + BullMQ entegrasyonu
Basit Agent CRUD API'leri
Mail-Analyst agent prototipi
React temel arayüz (agent listeleme)
PDF upload ve özetleme özelliği
Bu prompt ile başla ve mevcut dosyalardaki bilgileri sürekli referans alarak geliştir. Türkçe dokümantasyon ve yorumlar ekleyebilirsin.

Code

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

## 📊 Proje Hedefleri

- [x] Ölçeklenebilir mimari tasarımı
- [x] Geliştirme dokümanları hazırlığı
- [ ] Backend core modülleri
- [ ] Frontend dashboard
- [ ] Agent engine prototipi
- [ ] Mail analiz sistemi
- [ ] Dosya işleme modülleri
- [ ] LLM entegrasyonu

## 🤝 Katkıda Bulunma

Bu proje ölçeklenebilir yapı odaklı geliştirme için bir template olarak tasarlanmıştır. Katkılarınızı bekliyoruz!

## 📄 Lisans

Bu proje açık kaynak kodludur ve MIT lisansı altında paylaşılmaktadır.

---

**Not**: Bu repository'deki tüm dosyalar, benzer ölçeklenebilir projeler için kalıp olarak kullanılabilir. Özellikle `.github/copilot-instructions.md` dosyası, diğer projelerinizde de Copilot Agent'ın doğru yaklaşımla çalışması için adapte edilebilir.