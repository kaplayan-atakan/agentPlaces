import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  Logger,
} from '@nestjs/common';
import { QueueManagerService, TaskJob, TaskStats } from './services/queue-manager.service';
import { CreateTaskDto, RetryTaskDto, TaskType } from './dto/queue-manager.dto';

@Controller('queue')
export class QueueManagerController {
  private readonly logger = new Logger(QueueManagerController.name);

  constructor(private readonly queueManagerService: QueueManagerService) {}

  @Post('tasks')
  async createTask(@Body() createTaskDto: CreateTaskDto) {
    try {
      this.logger.log('Create task request received');
      const result = await this.queueManagerService.addTask(createTaskDto);
      return {
        success: true,
        data: result,
        message: 'Task created successfully',
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Task creation failed: ${errorMessage}`);
      return {
        success: false,
        error: errorMessage,
        message: 'Task creation failed',
      };
    }
  }

  @Get('tasks/:taskId')
  async getTaskStatus(
    @Param('taskId') taskId: string,
    @Query('type') taskType: TaskType,
  ) {
    try {
      this.logger.log(`Get task status request: ${taskId}`);
      const result = await this.queueManagerService.getTaskStatus(taskId, taskType);
      
      if (!result) {
        return {
          success: false,
          error: 'Task not found',
          message: 'Task not found',
        };
      }

      return {
        success: true,
        data: result,
        message: 'Task status retrieved successfully',
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Get task status failed: ${errorMessage}`);
      return {
        success: false,
        error: errorMessage,
        message: 'Get task status failed',
      };
    }
  }

  @Post('tasks/:taskId/retry')
  async retryTask(
    @Param('taskId') taskId: string,
    @Query('type') taskType: TaskType,
    @Body() retryTaskDto?: Partial<RetryTaskDto>,
  ) {
    try {
      this.logger.log(`Retry task request: ${taskId}`);
      const dto: RetryTaskDto = {
        taskId,
        newData: retryTaskDto?.newData,
      };
      
      const result = await this.queueManagerService.retryTask(dto, taskType);
      return {
        success: true,
        data: result,
        message: 'Task retried successfully',
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Task retry failed: ${errorMessage}`);
      return {
        success: false,
        error: errorMessage,
        message: 'Task retry failed',
      };
    }
  }

  @Delete('tasks/:taskId')
  async removeTask(
    @Param('taskId') taskId: string,
    @Query('type') taskType: TaskType,
  ) {
    try {
      this.logger.log(`Remove task request: ${taskId}`);
      const result = await this.queueManagerService.removeTask(taskId, taskType);
      
      if (!result) {
        return {
          success: false,
          error: 'Task not found',
          message: 'Task not found',
        };
      }

      return {
        success: true,
        data: { taskId, removed: true },
        message: 'Task removed successfully',
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Task removal failed: ${errorMessage}`);
      return {
        success: false,
        error: errorMessage,
        message: 'Task removal failed',
      };
    }
  }

  @Get('stats')
  async getQueueStats(@Query('type') taskType?: TaskType) {
    try {
      this.logger.log('Get queue stats request received');
      const result = await this.queueManagerService.getQueueStats(taskType);
      return {
        success: true,
        data: result,
        message: 'Queue stats retrieved successfully',
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Get queue stats failed: ${errorMessage}`);
      return {
        success: false,
        error: errorMessage,
        message: 'Get queue stats failed',
      };
    }
  }

  @Get('jobs')
  async getRecentJobs(
    @Query('type') taskType: TaskType,
    @Query('limit') limit?: number,
  ) {
    try {
      this.logger.log(`Get recent jobs request: ${taskType}`);
      const result = await this.queueManagerService.getRecentJobs(
        taskType,
        limit || 50,
      );
      return {
        success: true,
        data: result,
        message: 'Recent jobs retrieved successfully',
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Get recent jobs failed: ${errorMessage}`);
      return {
        success: false,
        error: errorMessage,
        message: 'Get recent jobs failed',
      };
    }
  }

  @Patch('pause')
  async pauseQueue(@Query('type') taskType: TaskType) {
    try {
      this.logger.log(`Pause queue request: ${taskType}`);
      await this.queueManagerService.pauseQueue(taskType);
      return {
        success: true,
        data: { type: taskType, status: 'paused' },
        message: 'Queue paused successfully',
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Pause queue failed: ${errorMessage}`);
      return {
        success: false,
        error: errorMessage,
        message: 'Pause queue failed',
      };
    }
  }

  @Patch('resume')
  async resumeQueue(@Query('type') taskType: TaskType) {
    try {
      this.logger.log(`Resume queue request: ${taskType}`);
      await this.queueManagerService.resumeQueue(taskType);
      return {
        success: true,
        data: { type: taskType, status: 'active' },
        message: 'Queue resumed successfully',
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Resume queue failed: ${errorMessage}`);
      return {
        success: false,
        error: errorMessage,
        message: 'Resume queue failed',
      };
    }
  }

  @Delete('clean')
  async cleanQueue(
    @Query('type') taskType: TaskType,
    @Query('olderThan') olderThan: number = 24 * 60 * 60 * 1000, // 24 hours default
  ) {
    try {
      this.logger.log(`Clean queue request: ${taskType}`);
      const result = await this.queueManagerService.cleanQueue(taskType, olderThan);
      return {
        success: true,
        data: { type: taskType, cleaned: result },
        message: 'Queue cleaned successfully',
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Clean queue failed: ${errorMessage}`);
      return {
        success: false,
        error: errorMessage,
        message: 'Clean queue failed',
      };
    }
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'queue-manager',
      timestamp: new Date().toISOString(),
    };
  }
}
