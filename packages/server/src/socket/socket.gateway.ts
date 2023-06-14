import { SocketService } from '@/socket/socket.service';
import { UseGuards } from '@nestjs/common';
import {
  // connected-socket
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketAuthGuard } from './socket-auth.guard';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  path: '/api/socket.io',
})
export class SocketGateway {
  constructor(private readonly socketService: SocketService) {}

  @WebSocketServer()
  server: Server;

  @UseGuards(SocketAuthGuard)
  @SubscribeMessage('terminal')
  terminal(@ConnectedSocket() socket: Socket, @MessageBody() payload: any) {
    this.socketService.terminal(socket, payload);
  }

  @UseGuards(SocketAuthGuard)
  @SubscribeMessage('debug')
  debug(@ConnectedSocket() socket: Socket, @MessageBody() payload: any) {
    this.socketService.debug(socket, payload);
  }
}
