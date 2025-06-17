import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth(): { status: string; uptime: number; timestamp: string } {
    return {
      status: 'OK',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}
