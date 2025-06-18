import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AgentsModule } from './modules/agents/agents.module';
import { FileProcessingModule } from './modules/file-processing/file-processing.module';
import { MailAnalysisModule } from './modules/mail-analysis/mail-analysis.module';
import { QueueManagerModule } from './modules/queue-manager/queue-manager.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisUrl = configService.get<string>('redis.url');
        if (redisUrl.startsWith('redis://')) {
          return { redis: { url: redisUrl } };
        }
        return {
          redis: {
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379'),
            password: process.env.REDIS_PASSWORD,
          },
        };
      },
    }),
    AgentsModule,
    FileProcessingModule,
    MailAnalysisModule,
    QueueManagerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
