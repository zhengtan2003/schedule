import {Injectable} from '@nestjs/common';
import {UserService} from './user/user.service';
import {TaskService} from './task/task.service';

@Injectable()
export class AppService {
    constructor(
        private readonly userService: UserService,
        private readonly taskService: TaskService,
    ) {
    }

    async initialize() {
        const users = await this.userService.find();
        users.forEach(async (user) => {
            const tasks = await this.taskService.find({where: {user: {id: user.id}}});
            tasks.forEach((task) => {
                if (task.status === "processing") this.taskService.start(task.id,{user})
            })
        })
    }
}
