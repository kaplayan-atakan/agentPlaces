/**
 * AgentPlaces - File Processing Module
 * Dosya yükleme, işleme ve analiz için kapsamlı modül
 * Ölçeklenebilir ve async processing desteği
 */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
// import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { FileProcessingController } from './file-processing.controller';
import { FileProcessingService } from './file-processing.service';
import { PdfParserService } from './services/pdf-parser.service';
import { MailParserService } from './services/mail-parser.service';
import { DocumentAnalyzerService } from './services/document-analyzer.service';
import { FileQueueService } from './services/file-queue.service';
import { FileProcessorConsumer } from './consumers/file-processor.consumer';

import { FileSchema } from './schemas/file.schema';

@Module({
  imports: [
    // MongoDB Schema
    MongooseModule.forFeature([{ name: 'File', schema: FileSchema }]),

    // File Upload Configuration
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, callback) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
          },
        }),
        fileFilter: (req, file, callback) => {
          // Supported file types
          const allowedTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'text/plain',
            'message/rfc822', // .eml files
          ];

          if (allowedTypes.includes(file.mimetype)) {
            callback(null, true);
          } else {
            callback(new Error('Desteklenmeyen dosya türü'), false);
          }
        },
        limits: {
          fileSize: 50 * 1024 * 1024, // 50MB limit
        },
      }),
      inject: [ConfigService],
    }),
    // Queue Configuration - Temporarily disabled
    // BullModule.registerQueue({
    //   name: 'file-processing',
    //   redis: {
    //     host: process.env.REDIS_HOST || 'localhost',
    //     port: parseInt(process.env.REDIS_PORT || '6379') || 6379,
    //     password: process.env.REDIS_PASSWORD,
    //   },
    // }),
  ],
  controllers: [FileProcessingController],
  providers: [
    FileProcessingService,
    PdfParserService,
    MailParserService,
    DocumentAnalyzerService,
    // FileQueueService, // Temporarily disabled due to Redis dependency
    // FileProcessorConsumer, // Temporarily disabled due to Redis dependency
  ],
  exports: [FileProcessingService],
})
export class FileProcessingModule {}
