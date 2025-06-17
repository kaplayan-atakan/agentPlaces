import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AgentsModule } from './modules/agents/agents.module';
import { FileProcessingModule } from './modules/file-processing/file-processing.module';
import { MailAnalysisModule } from './modules/mail-analysis/mail-analysis.module';
import { QueueManagerModule } from './modules/queue-manager/queue-manager.module';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
    }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri:
          process.env.MONGODB_URI ||
          'mongodb://agentplaces:development123@localhost:27017/agentplaces?authSource=admin',
      }),
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
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
