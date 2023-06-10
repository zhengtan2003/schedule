import { TaskLog } from '@/task-log/entities/task-log.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskLogController } from './task-log.controller';
import { TaskLogService } from './task-log.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaskLog])],
  controllers: [TaskLogController],
  providers: [TaskLogService],
  exports: [TaskLogService],
})
export class TaskLogModule {}
