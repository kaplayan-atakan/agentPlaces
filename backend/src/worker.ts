import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrapWorker() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const configService = app.get(ConfigService);

  console.log('🔧 AgentPlaces Worker başlatılıyor...');
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️ Database: ${configService.get('database.uri')}`);
  console.log(`📨 Redis: ${configService.get('redis.url')}`);

  // Worker sadece queue işlemlerini yapar, HTTP server başlatmaz
  console.log('✅ Worker hazır - Queue işlemlerini bekliyor...');

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('🛑 Worker kapatılıyor...');
    await app.close();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    console.log('🛑 Worker kapatılıyor...');
    await app.close();
    process.exit(0);
  });
}

bootstrapWorker().catch((error) => {
  console.error('❌ Worker başlatılamadı:', error);
  process.exit(1);
});
