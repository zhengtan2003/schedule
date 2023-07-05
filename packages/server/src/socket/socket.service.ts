import { TaskService } from '@/task/task.service';
import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';

@Injectable()
export class SocketService {
  constructor(private readonly taskService: TaskService) {}

  terminal(socket, payload) {
    const cp = spawn(payload, {
      shell: true,
    });
    cp.stdout.on('data', (data) => {
      socket.emit('terminal', `${data}`);
    });
    cp.stderr.on('data', (data) => {
      socket.emit('terminal', `${data}`);
    });
    cp.on('close', () => {
      socket.emit('terminal', `$ `);
    });
  }

  spawn(command: string, options, socket) {
    return new Promise((resolve) => {
      const cp = spawn(command, options);
      cp.stdout.on('data', (data) => {
        socket.emit('debug', `${data}`);
      });
      cp.stderr.on('data', (data) => {
        socket.emit('debug', `${data}`);
      });
      cp.on('close', () => {
        resolve('');
      });
    });
  }

  async debug(socket, payload) {
    const { taskId, envId, scriptIds } = payload;
    const task = await this.taskService.findOne({
      relations: ['scripts', 'envs'],
      where: { id: taskId },
    });
    const env = task.envs.find(({ id }) => id === envId);
    for (let i = 0; i < scriptIds.length; i++) {
      const script = task.scripts.find(({ id }) => id == scriptIds[i]);
      if (!script) continue;
      const startTime = Date.now();
      socket.emit(
        'debug',
        `🐞 \x1b[36m调试开始，执行脚本：\x1b[0m\x1b[34m${script.name}\x1b[0m\n`,
      );
      await this.spawn(
        `${script.startCommand} ${script.filePath}`,
        {
          shell: true,
          env: {
            ...process.env,
            ...JSON.parse(env.code),
          },
        },
        socket,
      );
      socket.emit(
        'debug',
        `🐞 \x1b[36m调试结束，耗时：\x1b[0m\x1b[34m${
          (Date.now() - startTime) / 1000
        } s\x1b[0m\n`,
      );
      socket.emit('debug', `\n`);
    }
    socket.emit('debug', 'end');
  }
}
