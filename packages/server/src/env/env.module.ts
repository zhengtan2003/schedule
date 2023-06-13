import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Env } from './entities/env.entity';
import { EnvController } from './env.controller';
import { EnvService } from './env.service';

@Module({
  imports: [TypeOrmModule.forFeature([Env])],
  controllers: [EnvController],
  providers: [EnvService],
  exports: [EnvService],
})
export class EnvModule {}
