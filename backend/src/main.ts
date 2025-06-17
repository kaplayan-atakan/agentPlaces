import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);

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
  // CORS configuration
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3009', // Frontend port
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global prefix
  app.setGlobalPrefix('api');
  const port = configService.get<number>('app.port') || 3001;
  console.log(`🌐 CORS enabled for: http://localhost:3009`);
  await app.listen(port);

  console.log(
    `🚀 AgentPlaces Backend is running on: http://localhost:${port}/api`,
  );
  console.log(`📊 Environment: ${configService.get('app.environment')}`);
}
bootstrap();
