import {
  IsOptional,
  IsNumber,
  IsString,
  IsIn,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UploadFileDto {
  file: Express.Multer.File;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  agentId?: string;
}

export class FileQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;

  @IsOptional()
  @IsIn(['pending', 'processing', 'completed', 'failed'])
  status?: 'pending' | 'processing' | 'completed' | 'failed';

  @IsOptional()
  @IsString()
  mimetype?: string;

  @IsOptional()
  @IsString()
  search?: string;
}

export class ProcessFileDto {
  @IsOptional()
  @IsBoolean()
  extractText?: boolean = true;

  @IsOptional()
  @IsBoolean()
  analyzeContent?: boolean = true;

  @IsOptional()
  @IsBoolean()
  generateSummary?: boolean = false;
}
