import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(Task)
        private taskRepository: Repository<Task>,
    ) {
    }

    async create(createTaskDto: CreateTaskDto, user) {
        const { name, startTime, endTime, cronTime } = createTaskDto;
        const task = new Task();
        task.name = name;
        task.endTime = endTime;
        task.cronTime = cronTime;
        task.startTime = startTime;
        task.user = user;
        await this.taskRepository.save(task);
    }

    async list({ params }, { user }) {
        const { current = 1, pageSize = 10 } = params;
        const [data, total] = await this.taskRepository.findAndCount({
            where: {
                user: { id: user.id },
                // name: params.name,
                // status: params.status
            },
            take: pageSize,
            skip: (current - 1) * pageSize,
        });
        return {
            data,
            total,
        };
    }

    findOne(id: number) {
        return `This action returns a #${id} task`;
    }

    update(id: number, updateTaskDto: UpdateTaskDto) {
        return `This action updates a #${id} task`;
    }

    remove(id: number) {
        return `This action removes a #${id} task`;
    }
}
