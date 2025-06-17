import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { QueueManagerController } from './queue-manager.controller';
import { QueueManagerService } from './services/queue-manager.service';
import { FileProcessorConsumer } from './processors/file-processor.consumer';
import { MailAnalysisConsumer } from './processors/mail-analysis.consumer';
import { ResponseGenerationConsumer } from './processors/response-generation.consumer';

@Module({
  imports: [
    BullModule.registerQueue(
      {
        name: 'file-processing',
      },
      {
        name: 'mail-analysis',
      },
      {
        name: 'response-generation',
      },
    ),
  ],
  controllers: [QueueManagerController],
  providers: [
    QueueManagerService,
    FileProcessorConsumer,
    MailAnalysisConsumer,
    ResponseGenerationConsumer,
  ],
  exports: [QueueManagerService],
})
export class QueueManagerModule {}
