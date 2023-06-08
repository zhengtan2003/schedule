import { Module } from '@nestjs/common';
import { TaskService } from '@/task/task.service';
import { Task } from '@/task/entities/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from '@/task/task.controller';
import { TaskEnv } from '@/task/entities/task-env.entity';
import { TaskLog } from '@/task/entities/task-log.entity';
import { ScriptModule } from '@/script/script.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Task]),
        TypeOrmModule.forFeature([TaskEnv]),
        TypeOrmModule.forFeature([TaskLog]),
        ScriptModule,
    ],
    controllers: [TaskController],
    providers: [TaskService],
    exports: [TaskService],
})
export class TaskModule {}
