import { IsString, IsOptional, IsObject, IsEnum, IsNumber } from 'class-validator';

export enum TaskType {
  FILE_PROCESSING = 'file_processing',
  MAIL_ANALYSIS = 'mail_analysis',
  RESPONSE_GENERATION = 'response_generation',
  BATCH_PROCESSING = 'batch_processing',
  SCHEDULED_TASK = 'scheduled_task',
}

export enum TaskPriority {
  LOW = 1,
  NORMAL = 2,
  HIGH = 3,
  CRITICAL = 4,
}

export class CreateTaskDto {
  @IsString()
  name: string;

  @IsEnum(TaskType)
  type: TaskType;

  @IsObject()
  data: Record<string, any>;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @IsNumber()
  @IsOptional()
  delay?: number;

  @IsString()
  @IsOptional()
  agentId?: string;

  @IsObject()
  @IsOptional()
  options?: Record<string, any>;
}

export class RetryTaskDto {
  @IsString()
  taskId: string;

  @IsObject()
  @IsOptional()
  newData?: Record<string, any>;
}

export class ScheduleTaskDto {
  @IsString()
  name: string;

  @IsEnum(TaskType)
  type: TaskType;

  @IsObject()
  data: Record<string, any>;

  @IsString()
  cronExpression: string;

  @IsString()
  @IsOptional()
  agentId?: string;
}
