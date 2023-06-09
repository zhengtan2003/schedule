import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'ws';
import { spawn } from 'child_process';

@WebSocketGateway(8080)
export class TerminalGateway {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('COMMAND')
    onEvent(client: any, data: any) {
        const childProcess = spawn(data, {
            shell: true,
        });
        childProcess.stdout.on('data', (data) => {
            client.send(data.toString());
        });
        childProcess.stderr.on('data', (data) => {
            client.send(data.toString());
        });
        childProcess.on('close', () => {
            client.send('$ ');
        });
    }
}
