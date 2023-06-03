import {Controller, OnModuleInit,Get} from '@nestjs/common';
import { AppService } from './app.service';
import { spawn } from 'child_process';

@Controller()
export class AppController implements OnModuleInit {
  constructor(private readonly appService: AppService) {}

  async onModuleInit() {
    await this.appService.initialize();
  }
}
