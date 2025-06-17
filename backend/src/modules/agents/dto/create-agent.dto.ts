import { IsString, IsNotEmpty, IsOptional, IsEnum, IsObject, IsArray, IsBoolean, MinLength, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAgentDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(500)
  description: string;

  @IsEnum(['mail-analyst', 'file-processor', 'general-assistant', 'custom'])
  type: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(20)
  promptTemplate: string;

  @IsEnum(['openai', 'local', 'groq'])
  @IsOptional()
  llmProvider?: string = 'openai';

  @IsObject()
  @IsOptional()
  llmConfig?: {
    maxTokens?: number;
    temperature?: number;
    topP?: number;
    [key: string]: any;
  };

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  capabilities?: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
}
