import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Script } from './entities/script.entity';
import { ScriptController } from './script.controller';
import { ScriptService } from './script.service';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Script])],
  controllers: [ScriptController],
  providers: [ScriptService],
  exports: [ScriptService],
})
export class ScriptModule {}
