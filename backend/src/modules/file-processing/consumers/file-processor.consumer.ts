import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { FileProcessingService } from '../file-processing.service';

@Processor('file-processing')
export class FileProcessorConsumer {
  private readonly logger = new Logger(FileProcessorConsumer.name);

  constructor(private fileService: FileProcessingService) {}

  @Process('process-file')
  async handleFileProcessing(job: Job) {
    const { fileId } = job.data;

    try {
      this.logger.log(`Processing file: ${fileId}`);

      await job.progress(10);

      // Process the file with default options
      const result = await this.fileService.processFile(fileId, {
        extractText: true,
        analyzeContent: true,
        generateSummary: false,
      });

      await job.progress(100);

      this.logger.log(`File processing completed: ${fileId}`);
      return result;
    } catch (error) {
      this.logger.error(`File processing failed: ${fileId} - ${error.message}`);
      throw error;
    }
  }
}
