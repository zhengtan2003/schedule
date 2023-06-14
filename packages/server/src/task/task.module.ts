import { EnvModule } from '@/env/env.module';
import { LoggerModule } from '@/logger/logger.module';
import { ScriptModule } from '@/script/script.module';
import { Task } from '@/task/entities/task.entity';
import { TaskController } from '@/task/task.controller';
import { TaskService } from '@/task/task.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    ScriptModule,
    EnvModule,
    LoggerModule,
  ],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
