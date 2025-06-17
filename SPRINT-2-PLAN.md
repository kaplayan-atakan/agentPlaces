# AgentPlaces - Sprint 2: File Processing & Mail Analysis

## 🎯 Sprint 2 Hedefleri
- **File Processing Module**: PDF, Word, Excel, PowerPoint dosya işleme
- **Mail Analysis Module**: E-posta thread analizi ve response generation
- **Queue System**: BullMQ ile asenkron task işleme
- **File Upload UI**: Modern drag-drop dosya yükleme arayüzü

## 📁 Yeni Modüller

### 1. File Processing Module (`backend/src/modules/file-processing/`)
- **FileProcessingService**: Dosya işleme core servisi
- **PdfParserService**: PDF dosya analizi
- **MailParserService**: E-posta dosya formatları
- **DocumentAnalyzerService**: Office dokümanlları
- **FileQueueService**: Asenkron dosya işleme

### 2. Mail Analysis Module (`backend/src/modules/mail-analysis/`)
- **MailAnalysisService**: E-posta analiz engine
- **ThreadAnalyzerService**: E-posta thread analizi
- **ResponseGeneratorService**: Akıllı yanıt üretimi
- **SentimentAnalysisService**: Duygu analizi

### 3. Queue Manager Module (`backend/src/modules/queue-manager/`)
- **QueueManagerService**: BullMQ yönetimi
- **TaskProcessorService**: Task execution
- **JobSchedulerService**: Zamanlanmış görevler
- **QueueMonitoringService**: Queue durumu takibi

### 4. Frontend File Upload (`frontend/src/components/file-upload/`)
- **FileUploader**: Drag-drop dosya yükleme
- **FileProgress**: Upload progress tracking
- **FilePreview**: Dosya önizleme
- **FileManager**: Yüklenen dosyalar yönetimi

## 🔧 Teknoloji Entegrasyonları
- **Multer**: File upload handling
- **pdf-parse**: PDF text extraction
- **mammoth**: Word document processing
- **xlsx**: Excel file processing
- **BullMQ**: Queue management
- **Redis**: Queue storage
- **MinIO**: File storage

## 📊 API Endpoints (Sprint 2)
```
POST /api/files/upload          # Dosya yükleme
GET  /api/files                 # Dosya listesi
GET  /api/files/:id             # Dosya detayı
POST /api/files/:id/process     # Dosya işleme başlat
GET  /api/files/:id/analysis    # Dosya analiz sonucu

POST /api/mail/analyze          # Mail analizi
POST /api/mail/generate-response # Yanıt üretimi
GET  /api/mail/threads          # Mail thread'leri

GET  /api/queue/stats           # Queue istatistikleri
GET  /api/queue/jobs/:id        # Job durumu
POST /api/queue/jobs/:id/retry  # Job yeniden başlat
```

## 🚀 Geliştirme Sırası
1. **File Processing Backend** (2-3 gün)
2. **Mail Analysis Backend** (2-3 gün)
3. **Queue System Setup** (1-2 gün)
4. **Frontend File Upload UI** (2-3 gün)
5. **Integration & Testing** (1-2 gün)

## 🛠️ Kurulum Notları
- BullMQ Redis bağlantısı yapılandırılacak
- MinIO bucket'ları otomatik oluşturulacak
- File processing worker'ları konfigüre edilecek
- Frontend file type validations eklenecek

Bu sprint sonunda kullanıcılar dosya yükleyip analiz edebilecek, e-posta thread'lerini analiz edebilecek ve sistem asenkron olarak dosyaları işleyebilecek.
