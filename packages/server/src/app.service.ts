import { Injectable } from '@nestjs/common';
import { UserService } from './user/user.service';
import { TaskService } from './task/task.service';

@Injectable()
export class AppService {
    constructor(
        private readonly userService: UserService,
        private readonly taskService: TaskService,
    ) {}

    async restartTask() {
        const users = await this.userService.find({ relations: ['task'] });
        users.forEach((user) => {
            user.task.forEach((task) => {
                if (task.cronName)
                    this.taskService.start(task.id, { id: user.id });
            });
        });
    }
}
