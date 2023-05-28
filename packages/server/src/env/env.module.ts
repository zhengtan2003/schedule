import { forwardRef, Module } from '@nestjs/common';
import { EnvController } from './env.controller';
import { EnvService } from './env.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Env } from './env.entity';
import { UserModule } from '../user/user.module';
import { TaskModule } from '../task/task.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Env]),
    forwardRef(() => TaskModule),
    UserModule,
  ],
  controllers: [EnvController],
  providers: [EnvService],
  exports: [EnvService],
})
export class EnvModule {}
