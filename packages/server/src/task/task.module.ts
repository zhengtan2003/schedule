import { ScriptModule } from '@/script/script.module';
import { TaskLogModule } from '@/task-log/task-log.module';
import { Task } from '@/task/entities/task.entity';
import { TaskController } from '@/task/task.controller';
import { TaskService } from '@/task/task.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), ScriptModule, TaskLogModule],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
