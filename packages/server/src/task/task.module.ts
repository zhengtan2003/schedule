import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './entities/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from './task.controller';
import { TaskEnv } from './entities/task-env.entity';
import { TaskLog } from './entities/task-log.entity';
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
