import { Module } from '@nestjs/common';
import { EnvService } from './env.service';
import { Env } from './entities/env.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvController } from './env.controller';
@Module({
    imports: [
        TypeOrmModule.forFeature([Env]),
    ],
    controllers: [EnvController],
    providers: [EnvService],
    exports: [EnvService],
})
export class EnvModule {
}
