import {Task} from './task.entity';
import {HttpModule} from '@nestjs/axios';
import {TaskService} from './task.service';
import {EnvModule} from '../env/env.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {TaskController} from './task.controller';
import {Module} from '@nestjs/common';

@Module({
    imports: [
        EnvModule,
        HttpModule,
        TypeOrmModule.forFeature([Task]),
    ],
    controllers: [TaskController],
    providers: [TaskService],
    exports: [TaskService],
})
export class TaskModule {
}
