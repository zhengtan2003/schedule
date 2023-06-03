import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { EnvModule } from '@/env/env.module';
import { Env } from '@/env/entities/env.entity';
import { Task } from './entities/task.entity';
import { TaskLog } from './entities/task-log.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from './task.controller';
import { ScriptModule } from '@/script/script.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Task]),
        TypeOrmModule.forFeature([TaskLog]),
        EnvModule,
        TypeOrmModule.forFeature([Env]),
        ScriptModule,
    ],
    controllers: [TaskController],
    providers: [TaskService],
    exports: [TaskService],
})
export class TaskModule {
}
