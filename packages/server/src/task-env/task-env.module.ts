import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEnv } from './entities/task-env.entity';
import { TaskEnvController } from './task-env.controller';
import { TaskEnvService } from './task-env.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaskEnv])],
  controllers: [TaskEnvController],
  providers: [TaskEnvService],
  exports: [TaskEnvService],
})
export class TaskEnvModule {}
