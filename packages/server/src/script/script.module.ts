import { Module } from '@nestjs/common';
import { ScriptService } from './script.service';
import { ScriptController } from './script.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Script } from './entities/script.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Script]),
    ],
    controllers: [ScriptController],
    providers: [ScriptService],
    exports: [ScriptService],
})
export class ScriptModule {
}
