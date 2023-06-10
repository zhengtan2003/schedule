import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ScriptModule } from './script/script.module';
import { TaskEnvModule } from './task-env/task-env.module';
import { TaskModule } from './task/task.module';
import { TerminalModule } from './terminal/terminal.module';
import { UserModule } from './user/user.module';
import { TaskLogModule } from './task-log/task-log.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      timezone: '+08:00',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      autoLoadEntities: true,
    }),
    UserModule,
    AuthModule,
    TaskModule,
    ScriptModule,
    TerminalModule,
    ScheduleModule.forRoot(),
    TaskEnvModule,
    TaskLogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
