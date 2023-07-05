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
    // const users = await this.userService.find({ relations: ['task'] });
    // users.forEach((user) => {
    //   user.task.forEach((task) => {
    //     if (task.cronName) this.taskService.cronLaunch(task, { id: user.id });
    //   });
    // });
  }
}
