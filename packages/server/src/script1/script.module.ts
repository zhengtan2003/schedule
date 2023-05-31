import { HttpModule } from '@nestjs/axios';
import { ScriptService } from './script.service';
import { ScriptController } from './script.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Script } from "./script.entity";

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Script]),
  ],
  controllers: [ScriptController],
  providers: [ScriptService],
  exports: [ScriptService],
})
export class ScriptModule {}
