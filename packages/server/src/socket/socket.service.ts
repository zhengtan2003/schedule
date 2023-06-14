import { TaskService } from '@/task/task.service';
import { getStartCommand } from '@/utils';
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

  async debug(socket, payload) {
    const { taskId, envId } = payload;
    const task = await this.taskService.findOne({
      relations: ['script', 'env'],
      where: { id: taskId },
    });
    const env = task.env.find(({ id }) => id === envId);
    const startCommand = getStartCommand(task.script.language);
    socket.emit('debug', `\x1b[32m调试开始...\x1b[0m\n`);
    const startTime = Date.now();
    const cp = spawn(`${startCommand} ${task.script.filePath}`, {
      shell: true,
      env: {
        ...process.env,
        ...JSON.parse(env.code),
      },
    });
    cp.stdout.on('data', (data) => {
      console.log(`${data}`);
      socket.emit('debug', `${data}`);
    });
    cp.stderr.on('data', (data) => {
      socket.emit('debug', `${data}`);
    });
    cp.on('close', () => {
      socket.emit(
        'debug',
        `\x1b[32m调试结束，耗时：${(Date.now() - startTime) / 1000} s\x1b[0m`,
      );
    });
  }
}
