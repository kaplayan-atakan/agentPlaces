import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  Query,
  Logger,
} from '@nestjs/common';
import { MailAnalysisService } from './mail-analysis.service';
import {
  AnalyzeMailDto,
  GenerateResponseDto,
  CreateThreadDto,
  UpdateThreadDto,
} from './dto/mail-analysis.dto';

@Controller('mail')
export class MailAnalysisController {
  private readonly logger = new Logger(MailAnalysisController.name);

  constructor(private readonly mailAnalysisService: MailAnalysisService) {}

  @Post('analyze')
  async analyzeMail(@Body() analyzeMailDto: AnalyzeMailDto) {
    try {
      this.logger.log('Analyzing mail request received');
      const result = await this.mailAnalysisService.analyzeMail(analyzeMailDto);
      return {
        success: true,
        data: result,
        message: 'Mail analyzed successfully',
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Mail analysis failed: ${errorMessage}`);
      return {
        success: false,
        error: errorMessage,
        message: 'Mail analysis failed',
      };
    }
  }

  @Post('generate-response')
  async generateResponse(@Body() generateResponseDto: GenerateResponseDto) {
    try {
      this.logger.log('Generate response request received');
      const result = await this.mailAnalysisService.generateResponse(
        generateResponseDto,
      );
      return {
        success: true,
        data: result,
        message: 'Response generated successfully',
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Response generation failed: ${errorMessage}`);
      return {
        success: false,
        error: errorMessage,
        message: 'Response generation failed',
      };
    }
  }

  @Post('threads')
  async createThread(@Body() createThreadDto: CreateThreadDto) {
    try {
      this.logger.log('Create thread request received');
      const result = await this.mailAnalysisService.createThread(
        createThreadDto,
      );
      return {
        success: true,
        data: result,
        message: 'Thread created successfully',
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Thread creation failed: ${errorMessage}`);
      return {
        success: false,
        error: errorMessage,
        message: 'Thread creation failed',
      };
    }
  }

  @Get('threads')
  async getThreads(@Query('agentId') agentId?: string) {
    try {
      this.logger.log('Get threads request received');
      const result = await this.mailAnalysisService.getThreads(agentId);
      return {
        success: true,
        data: result,
        message: 'Threads retrieved successfully',
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Get threads failed: ${errorMessage}`);
      return {
        success: false,
        error: errorMessage,
        message: 'Get threads failed',
      };
    }
  }

  @Put('threads/:threadId')
  async updateThread(
    @Param('threadId') threadId: string,
    @Body() updateThreadDto: UpdateThreadDto,
  ) {
    try {
      this.logger.log(`Update thread request received for: ${threadId}`);
      const result = await this.mailAnalysisService.updateThread(
        threadId,
        updateThreadDto,
      );
      return {
        success: true,
        data: result,
        message: 'Thread updated successfully',
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Thread update failed: ${errorMessage}`);
      return {
        success: false,
        error: errorMessage,
        message: 'Thread update failed',
      };
    }
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'mail-analysis',
      timestamp: new Date().toISOString(),
    };
  }
}
