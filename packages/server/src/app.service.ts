import { Injectable } from '@nestjs/common';
import { TaskService } from './task/task.service';
import { UserService } from './user/user.service';

@Injectable()
export class AppService {
  constructor(
    private readonly userService: UserService,
    private readonly taskService: TaskService,
  ) {}

  async restartTask() {
    const users = await this.userService.find({ relations: ['tasks'] });
    users.forEach((user) => {
      user.tasks.forEach((task) => {
        if (task.status === 1) this.taskService.firing(task, user);
      });
    });
  }
}
