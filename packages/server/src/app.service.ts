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
        const users = await this.userService.findAll();
        users.forEach((user) => {
            this.taskService.find({ where: { user } }).then((tasks) => {
                tasks.forEach((task) => {
                    if (task.cronName) this.taskService.start(task.id, user);
                });
            });
        });
    }
}
