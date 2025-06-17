import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class FileQueueService {
  private readonly logger = new Logger(FileQueueService.name);

  constructor(@InjectQueue('file-processing') private fileQueue: Queue) {}

  async addFileToQueue(fileId: string, priority: number = 0): Promise<void> {
    try {
      const job = await this.fileQueue.add(
        'process-file',
        { fileId },
        {
          priority,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
          removeOnComplete: 50,
          removeOnFail: 20,
        },
      );

      this.logger.log(`File added to queue: ${fileId} (Job ID: ${job.id})`);
    } catch (error) {
      this.logger.error(`Queue error: ${error.message}`);
      throw error;
    }
  }

  async getQueueStats(): Promise<any> {
    try {
      const [waiting, active, completed, failed] = await Promise.all([
        this.fileQueue.getWaiting(),
        this.fileQueue.getActive(),
        this.fileQueue.getCompleted(),
        this.fileQueue.getFailed(),
      ]);

      return {
        waiting: waiting.length,
        active: active.length,
        completed: completed.length,
        failed: failed.length,
        total:
          waiting.length + active.length + completed.length + failed.length,
      };
    } catch (error) {
      this.logger.error(`Queue stats error: ${error.message}`);
      throw error;
    }
  }

  async getJobStatus(jobId: string): Promise<any> {
    try {
      const job = await this.fileQueue.getJob(jobId);
      if (!job) {
        return { status: 'not_found' };
      }

      return {
        id: job.id,
        status: await job.getState(),
        progress: job.progress(),
        data: job.data,
        created: job.timestamp,
        processed: job.processedOn,
        finished: job.finishedOn,
        failed: job.failedReason,
      };
    } catch (error) {
      this.logger.error(`Job status error: ${error.message}`);
      throw error;
    }
  }

  async retryFailedJob(jobId: string): Promise<void> {
    try {
      const job = await this.fileQueue.getJob(jobId);
      if (job) {
        await job.retry();
        this.logger.log(`Job retried: ${jobId}`);
      }
    } catch (error) {
      this.logger.error(`Job retry error: ${error.message}`);
      throw error;
    }
  }

  async clearQueue(): Promise<void> {
    try {
      await this.fileQueue.clean(0, 'completed');
      await this.fileQueue.clean(0, 'failed');
      this.logger.log('Queue cleared');
    } catch (error) {
      this.logger.error(`Queue clear error: ${error.message}`);
      throw error;
    }
  }
}
