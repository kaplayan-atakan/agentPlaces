import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  // Enable CORS for production and development
  app.enableCors(configService.get('cors'));

  // Request logging
  app.use((req: any, res: any, next: any) => {
    console.log(
      `📡 ${req.method} ${req.url} - Origin: ${req.headers.origin || 'direct'}`,
    );
    next();
  });
  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global prefix
  app.setGlobalPrefix('api');
  
  // Ensure Render can assign port dynamically
  const port = configService.get('port');
  await app.listen(port);
  
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`🚀 AgentPlaces Backend is running on: http://localhost:${port}/api`);
  console.log(`📊 Environment: ${configService.get('NODE_ENV') || 'development'}`);
  console.log(`🌐 CORS enabled for: ${configService.get('cors.origin')}`);
}
bootstrap();
