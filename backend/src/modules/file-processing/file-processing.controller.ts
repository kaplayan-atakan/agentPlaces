import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseInterceptors,
  UploadedFile,
  Delete,
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { FileProcessingService } from './file-processing.service';
import { UploadFileDto, FileQueryDto, ProcessFileDto } from './dto/file.dto';

@Controller('files')
export class FileProcessingController {
  constructor(private readonly fileService: FileProcessingService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    return this.fileService.uploadFile(file, body);
  }

  @Get()
  async getFiles(@Query() query: FileQueryDto) {
    return this.fileService.getFiles(query);
  }

  @Get(':id')
  async getFile(@Param('id') id: string) {
    return this.fileService.getFileById(id);
  }

  @Post(':id/process')
  async processFile(@Param('id') id: string, @Body() options: ProcessFileDto) {
    return this.fileService.processFile(id, options);
  }

  @Get(':id/analysis')
  async getFileAnalysis(@Param('id') id: string) {
    return this.fileService.getFileAnalysis(id);
  }

  @Patch(':id')
  async updateFile(@Param('id') id: string, @Body() updateData: any) {
    return this.fileService.updateFile(id, updateData);
  }

  @Delete(':id')
  async deleteFile(@Param('id') id: string) {
    return this.fileService.deleteFile(id);
  }

  @Get('stats/summary')
  async getFileStats() {
    return this.fileService.getFileStats();
  }
}
