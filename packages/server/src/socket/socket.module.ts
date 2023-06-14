import { TaskModule } from '@/task/task.module';
import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';

@Module({
  imports: [TaskModule],
  providers: [SocketGateway, SocketService],
})
export class SocketModule {}
