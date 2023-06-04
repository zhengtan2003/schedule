import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ScriptService } from './script.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Script } from './entities/script.entity';
import { ScriptController } from './script.controller';

@Module({
    imports: [HttpModule, TypeOrmModule.forFeature([Script])],
    controllers: [ScriptController],
    providers: [ScriptService],
    exports: [ScriptService],
})
export class ScriptModule {}
