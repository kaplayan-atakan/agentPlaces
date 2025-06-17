import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { CreateTaskDto, RetryTaskDto, TaskType, TaskPriority } from '../dto/queue-manager.dto';

export interface TaskStats {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
  paused: number;
}

export interface TaskJob {
  id: string;
  name: string;
  data: any;
  progress: number;
  status: string;
  created: Date;
  processed?: Date;
  finished?: Date;
  failed?: Date;
  error?: string;
}

@Injectable()
export class QueueManagerService {
  private readonly logger = new Logger(QueueManagerService.name);

  constructor(
    @InjectQueue('file-processing') private fileProcessingQueue: Queue,
    @InjectQueue('mail-analysis') private mailAnalysisQueue: Queue,
    @InjectQueue('response-generation') private responseGenerationQueue: Queue,
  ) {}

  async addTask(createTaskDto: CreateTaskDto): Promise<any> {
    try {
      this.logger.log(`Adding task: ${createTaskDto.name} (${createTaskDto.type})`);

      const queue = this.getQueueByType(createTaskDto.type);      const jobOptions = {
        priority: createTaskDto.priority || TaskPriority.NORMAL,
        delay: createTaskDto.delay || 0,
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: 100,
        removeOnFail: 50,
        ...createTaskDto.options,
      };

      const job = await queue.add(createTaskDto.name, createTaskDto.data, jobOptions);

      this.logger.log(`Task added successfully: ${job.id}`);
      return {
        taskId: job.id,
        name: createTaskDto.name,
        type: createTaskDto.type,
        status: 'waiting',
        created: new Date(),
        priority: createTaskDto.priority,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to add task: ${errorMessage}`);
      throw new Error(`Task creation failed: ${errorMessage}`);
    }
  }

  async getTaskStatus(taskId: string, taskType: TaskType): Promise<TaskJob | null> {
    try {
      const queue = this.getQueueByType(taskType);
      const job = await queue.getJob(taskId);

      if (!job) {
        return null;
      }

      return {
        id: job.id?.toString() || '',
        name: job.name,
        data: job.data,
        progress: job.progress(),
        status: await job.getState(),
        created: new Date(job.timestamp),
        processed: job.processedOn ? new Date(job.processedOn) : undefined,
        finished: job.finishedOn ? new Date(job.finishedOn) : undefined,
        failed: job.failedReason ? new Date() : undefined,
        error: job.failedReason,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to get task status: ${errorMessage}`);
      throw new Error(`Get task status failed: ${errorMessage}`);
    }
  }

  async retryTask(retryTaskDto: RetryTaskDto, taskType: TaskType): Promise<any> {
    try {
      this.logger.log(`Retrying task: ${retryTaskDto.taskId}`);

      const queue = this.getQueueByType(taskType);
      const job = await queue.getJob(retryTaskDto.taskId);

      if (!job) {
        throw new Error('Task not found');
      }

      if (retryTaskDto.newData) {
        job.data = { ...job.data, ...retryTaskDto.newData };
      }

      await job.retry();
      
      this.logger.log(`Task retried successfully: ${retryTaskDto.taskId}`);
      return {
        taskId: retryTaskDto.taskId,
        status: 'retrying',
        retriedAt: new Date(),
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to retry task: ${errorMessage}`);
      throw new Error(`Task retry failed: ${errorMessage}`);
    }
  }

  async removeTask(taskId: string, taskType: TaskType): Promise<boolean> {
    try {
      const queue = this.getQueueByType(taskType);
      const job = await queue.getJob(taskId);

      if (!job) {
        return false;
      }

      await job.remove();
      this.logger.log(`Task removed: ${taskId}`);
      return true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to remove task: ${errorMessage}`);
      throw new Error(`Task removal failed: ${errorMessage}`);
    }
  }

  async getQueueStats(taskType?: TaskType): Promise<Record<string, TaskStats>> {
    try {
      const stats: Record<string, TaskStats> = {};

      if (taskType) {
        const queue = this.getQueueByType(taskType);
        stats[taskType] = await this.getQueueStatsForQueue(queue);
      } else {
        // Get stats for all queues
        stats[TaskType.FILE_PROCESSING] = await this.getQueueStatsForQueue(this.fileProcessingQueue);
        stats[TaskType.MAIL_ANALYSIS] = await this.getQueueStatsForQueue(this.mailAnalysisQueue);
        stats[TaskType.RESPONSE_GENERATION] = await this.getQueueStatsForQueue(this.responseGenerationQueue);
      }

      return stats;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to get queue stats: ${errorMessage}`);
      throw new Error(`Get queue stats failed: ${errorMessage}`);
    }
  }

  async getRecentJobs(taskType: TaskType, limit = 50): Promise<TaskJob[]> {
    try {
      const queue = this.getQueueByType(taskType);
      const jobs = await queue.getJobs(['completed', 'failed', 'active', 'waiting'], 0, limit - 1);

      return await Promise.all(
        jobs.map(async (job) => ({
          id: job.id?.toString() || '',
          name: job.name,
          data: job.data,
          progress: job.progress(),
          status: await job.getState(),
          created: new Date(job.timestamp),
          processed: job.processedOn ? new Date(job.processedOn) : undefined,
          finished: job.finishedOn ? new Date(job.finishedOn) : undefined,
          failed: job.failedReason ? new Date() : undefined,
          error: job.failedReason,
        }))
      );
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to get recent jobs: ${errorMessage}`);
      throw new Error(`Get recent jobs failed: ${errorMessage}`);
    }
  }

  async pauseQueue(taskType: TaskType): Promise<void> {
    try {
      const queue = this.getQueueByType(taskType);
      await queue.pause();
      this.logger.log(`Queue paused: ${taskType}`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to pause queue: ${errorMessage}`);
      throw new Error(`Pause queue failed: ${errorMessage}`);
    }
  }

  async resumeQueue(taskType: TaskType): Promise<void> {
    try {
      const queue = this.getQueueByType(taskType);
      await queue.resume();
      this.logger.log(`Queue resumed: ${taskType}`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to resume queue: ${errorMessage}`);
      throw new Error(`Resume queue failed: ${errorMessage}`);
    }
  }
  async cleanQueue(taskType: TaskType, olderThan: number): Promise<number> {
    try {
      const queue = this.getQueueByType(taskType);
      const completedCleaned = await queue.clean(olderThan, 'completed');
      const failedCleaned = await queue.clean(olderThan, 'failed');
      const cleaned = completedCleaned.length + failedCleaned.length;
      
      this.logger.log(`Cleaned ${cleaned} jobs from queue: ${taskType}`);
      return cleaned;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to clean queue: ${errorMessage}`);
      throw new Error(`Clean queue failed: ${errorMessage}`);
    }
  }

  private getQueueByType(taskType: TaskType): Queue {
    switch (taskType) {
      case TaskType.FILE_PROCESSING:
        return this.fileProcessingQueue;
      case TaskType.MAIL_ANALYSIS:
        return this.mailAnalysisQueue;
      case TaskType.RESPONSE_GENERATION:
        return this.responseGenerationQueue;
      default:
        // Default to file processing queue for other types
        return this.fileProcessingQueue;
    }
  }

  private async getQueueStatsForQueue(queue: Queue): Promise<TaskStats> {
    const waiting = await queue.getWaiting();
    const active = await queue.getActive();
    const completed = await queue.getCompleted();
    const failed = await queue.getFailed();
    const delayed = await queue.getDelayed();
    const paused = await queue.isPaused();

    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
      delayed: delayed.length,
      paused: paused ? 1 : 0,
    };
  }
}
