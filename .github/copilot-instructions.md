# AgentPlaces Project Instructions

## Proje Genel Bakışı
Bu AgentPlaces projesi, kişisel agent yönetimi için ölçeklenebilir bir platform geliştirme workspace'idir. Modüler mimari ve mikro-servis yaklaşımı ile geliştirilmektedir.

## Ölçeklenebilir Mimari Prensipleri

### 🏗️ Modüler Yapı
- **Mikro-Seviye Parçacıklar**: Her fonksiyonalite bağımsız modül olarak tasarlanmalı
- **Loose Coupling**: Modüller arası bağımlılık minimum seviyede tutulmalı
- **High Cohesion**: Her modül tek bir sorumluluğa odaklanmalı
- **Plugin Architecture**: Yeni özellikler mevcut yapıyı bozmadan eklenebilmeli

### 🔧 Teknoloji Stack (Ölçeklenebilirlik Odaklı)
- **Backend**: NestJS (Dependency Injection, Modular Architecture)
- **Frontend**: React + TypeScript (Component-based, Reusable)
- **Database**: MongoDB (Horizontal Scaling, Sharding Ready)
- **Cache**: Redis (Cluster Support, Distributed Caching)
- **Queue**: BullMQ (Horizontal Worker Scaling)
- **Container**: Docker (Microservice Deployment Ready)

### 📁 Ölçeklenebilir Dosya Yapısı
agentPlaces/ ├── backend/ │ ├── src/ │ │ ├── modules/ │ │ │ ├── agents/ # Agent CRUD ve Management │ │ │ ├── file-processing/ # Dosya işleme servisleri │ │ │ ├── mail-analysis/ # Mail analiz engine │ │ │ ├── llm-integration/ # LLM servis adaptörleri │ │ │ ├── queue-manager/ # Task queue yönetimi │ │ │ └── auth/ # Kimlik doğrulama │ │ ├── shared/ # Ortak utilities │ │ └── config/ # Yapılandırma ├── frontend/ │ ├── src/ │ │ ├── components/ │ │ │ ├── agent-manager/ # Agent yönetim bileşenleri │ │ │ ├── file-upload/ # Dosya yükleme bileşenleri │ │ │ └── dashboard/ # Dashboard bileşenleri │ │ ├── services/ # API servis katmanı │ │ ├── hooks/ # Reusable React hooks │ │ └── stores/ # State management ├── shared/ │ ├── types/ # TypeScript type definitions │ ├── interfaces/ # Ortak interface'ler │ └── constants/ # Sabitler └── infrastructure/ ├── docker/ # Container yapılandırması ├── kubernetes/ # K8s deployment files └── monitoring/ # Loglama ve izleme

Code

## Geliştirme Standartları

### 📋 Kodlama Prensipleri
- **SOLID Principles**: Özellikle Single Responsibility ve Dependency Inversion
- **Clean Architecture**: Katmanlı mimari yapısını koru
- **Domain-Driven Design**: İş mantığını net modüller halinde organize et
- **Microservice Patterns**: Event-driven communication, Circuit Breaker, Bulkhead

### 🚀 Performans ve Ölçeklenebilirlik
- **Database Indexing**: Sorgu performansı için uygun indexler
- **Caching Strategy**: Redis ile multi-layer caching
- **Queue Processing**: Background job'lar için async processing
- **API Rate Limiting**: API endpoints için rate limiting
- **Connection Pooling**: Database bağlantı havuzu optimizasyonu

### 📊 Monitoring ve Observability
- **Structured Logging**: Winston ile JSON formatında log
- **Metrics Collection**: Prometheus/Grafana entegrasyonu hazır
- **Health Checks**: Her servis için health endpoint
- **Error Tracking**: Centralized error handling ve reporting

## Agent Modülleri (Ölçeklenebilir Tasarım)

### 🤖 Agent Engine Core
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
📄 Dosya İşleme Modülleri
PDF Parser: Multi-threaded PDF processing
Mail Parser: Email thread analysis
Document Analyzer: Word, Excel, PowerPoint support
File Queue: Asenkron dosya işleme kuyruğu
🔄 Task Execution Engine
Worker Pools: Paralel işlem kapasitesi
Job Prioritization: Önem sırasına göre işlem
Retry Mechanisms: Hata durumunda yeniden deneme
Dead Letter Queue: Başarısız işlemlerin takibi
Deployment ve DevOps
🐳 Containerization
Multi-stage Docker builds
Production-ready Docker Compose
Kubernetes deployment manifests
Health check endpoints
🔄 CI/CD Pipeline
Automated testing (Unit, Integration, E2E)
Code quality checks (ESLint, Prettier, SonarQube)
Security scanning
Automated deployment
📈 Monitoring Stack
Application metrics
Database performance monitoring
Queue processing metrics
User activity tracking
Geliştirme Kuralları
✅ Kod Kalitesi
Follow standard coding practices
Maintain clean and readable code
Document your changes appropriately
Use meaningful commit messages
Write comprehensive tests (minimum %80 coverage)
🔧 Türkçe Destek
Türkçe yorum ve dokümantasyon desteklenir
Değişken isimleri Türkçe olabilir (camelCase)
Kullanıcı arayüzü Türkçe
API response'ları çok dilli destek
🎯 Sprint Hedefleri
Sprint 1: Core backend + Agent CRUD + Basit React UI
Sprint 2: File processing + Mail analysis + Queue system
Sprint 3: LLM integration + Advanced UI + Authentication
Sprint 4: Performance optimization + Monitoring + Documentation

## 🚀 Geliştirme ve Çalıştırma

### Otomatik Yeniden Başlatma Komutları
Proje geliştirme sürecinde kullanılacak otomatik restart komutları:

```powershell
# Windows PowerShell için otomatik restart
.\restart.ps1

# Bash/Unix sistemler için
./restart.sh
```

### Manuel Başlatma Komutları
```powershell
# 1. Docker servislerini başlat
docker-compose up -d

# 2. Backend'i başlat (Port: 2809)
cd backend
npm run start:dev

# 3. Frontend'i başlat (Port: 3009) - Yeni Terminal
cd frontend
npm start
```

### Servis Portları
- **Backend API**: http://localhost:2809
- **Frontend UI**: http://localhost:3009
- **MongoDB**: mongodb://localhost:27017
- **Redis**: redis://localhost:6379
- **MinIO**: http://localhost:9000 (admin:password123)
- **MailHog**: http://localhost:8025

### Geliştirme Workflow
1. Değişiklikleri yap
2. `.\restart.ps1` komutu ile servisleri yeniden başlat
3. API endpointleri test et: `curl http://localhost:2809/agents`
4. Curl komutu Türkçe karakterlerle sorun yaşıyor. Test agent dosyasını kullanarak test et.
5. Frontend test et: http://localhost:3009
6. Değişiklikleri commit ve push et

Bu instruction'lar doğrultusunda geliştirme yaparken her zaman ölçeklenebilirlik, modülerlik ve performansı göz önünde bulundur.
