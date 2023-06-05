import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { validate } from './env.validation';
import { EnvModule } from './env/env.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';
import { AppController } from './app.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { ScriptModule } from './script/script.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            validate,
            envFilePath: [`.env.${process.env.NODE_ENV}`],
        }),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DATABASE_HOST || 'localhost',
            port: parseInt(process.env.DATABASE_PORT) || 3306,
            username: process.env.DATABASE_USERNAME || 'root',
            password: process.env.DATABASE_PASSWORD || 'schedule123456',
            database: process.env.DATABASE_DATABASE || 'schedule',
            timezone: '+08:00',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
        }),
        UserModule,
        AuthModule,
        EnvModule,
        TaskModule,
        ScriptModule,
        ScheduleModule.forRoot(),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
