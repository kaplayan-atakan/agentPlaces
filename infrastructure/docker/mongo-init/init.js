// MongoDB initialization script
// Kullanıcı ve koleksiyonları oluştur

use agentplaces;

// Agents koleksiyonu oluştur
db.createCollection("agents");

// Agents için index'ler
db.agents.createIndex({ "name": 1 });
db.agents.createIndex({ "type": 1 });
db.agents.createIndex({ "createdAt": -1 });
db.agents.createIndex({ "userId": 1 });

// Files koleksiyonu oluştur
db.createCollection("files");

// Files için index'ler
db.files.createIndex({ "filename": 1 });
db.files.createIndex({ "uploadedAt": -1 });
db.files.createIndex({ "agentId": 1 });

// Mail threads koleksiyonu oluştur
db.createCollection("mailthreads");

// Mail threads için index'ler
db.mailthreads.createIndex({ "threadId": 1 });
db.mailthreads.createIndex({ "subject": 1 });
db.mailthreads.createIndex({ "createdAt": -1 });

// Tasks koleksiyonu oluştur (Queue için)
db.createCollection("tasks");

// Tasks için index'ler
db.tasks.createIndex({ "status": 1 });
db.tasks.createIndex({ "priority": -1 });
db.tasks.createIndex({ "createdAt": -1 });

print("AgentPlaces veritabanı başarıyla kuruldu!");
