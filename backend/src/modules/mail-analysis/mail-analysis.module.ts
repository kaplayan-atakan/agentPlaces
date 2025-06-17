import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailAnalysisController } from './mail-analysis.controller';
import { MailAnalysisService } from './mail-analysis.service';
import { ThreadAnalyzerService } from './services/thread-analyzer.service';
import { ResponseGeneratorService } from './services/response-generator.service';
import { SentimentAnalysisService } from './services/sentiment-analysis.service';
import { MailThread, MailThreadSchema } from './schemas/mail-thread.schema';
import { MailAnalysis, MailAnalysisSchema } from './schemas/mail-analysis.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MailThread.name, schema: MailThreadSchema },
      { name: MailAnalysis.name, schema: MailAnalysisSchema },
    ]),
  ],
  controllers: [MailAnalysisController],
  providers: [
    MailAnalysisService,
    ThreadAnalyzerService,
    ResponseGeneratorService,
    SentimentAnalysisService,
  ],
  exports: [MailAnalysisService],
})
export class MailAnalysisModule {}
