import {
  IsString,
  IsArray,
  IsOptional,
  IsEmail,
  IsBoolean,
} from 'class-validator';

export class AnalyzeMailDto {
  @IsString()
  subject: string;

  @IsString()
  body: string;

  @IsEmail()
  from: string;

  @IsEmail()
  to: string;

  @IsString()
  @IsOptional()
  threadId?: string;

  @IsOptional()
  headers?: Record<string, any>;

  @IsString()
  @IsOptional()
  agentId?: string;
}

export class GenerateResponseDto {
  @IsString()
  threadId: string;

  @IsString()
  @IsOptional()
  context?: string;

  @IsString()
  @IsOptional()
  tone?: string;

  @IsString()
  @IsOptional()
  language?: string;

  @IsBoolean()
  @IsOptional()
  includeAttachments?: boolean;

  @IsString()
  @IsOptional()
  agentId?: string;
}

export class CreateThreadDto {
  @IsString()
  subject: string;

  @IsArray()
  participants: string[];

  @IsString()
  @IsOptional()
  agentId?: string;

  @IsArray()
  @IsOptional()
  labels?: string[];
}

export class UpdateThreadDto {
  @IsString()
  @IsOptional()
  status?: string;

  @IsArray()
  @IsOptional()
  labels?: string[];

  @IsString()
  @IsOptional()
  priority?: string;
}
