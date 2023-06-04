import { CronJob } from 'cron';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import { spawn } from 'child_process';
import { Injectable } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { HttpResponse } from '@/http-response';
import { EnvService } from '@/env/env.service';
import { Env } from '@/env/entities/env.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskLog } from './entities/task-log.entity';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ScriptService } from '@/script/script.service';


@Injectable()
export class TaskService {

    constructor(
        @InjectRepository(Task)
        private taskRepository: Repository<Task>,
        @InjectRepository(TaskLog)
        private taskLogRepository: Repository<TaskLog>,
        @InjectRepository(Env)
        private envRepository: Repository<Env>,
        private envService: EnvService,
        private scriptService: ScriptService,
        private schedulerRegistry: SchedulerRegistry,
    ) {
    }

    getCronName(userId, taskId) {
        return `cron_task_${userId}_${taskId}`;
    }

    async create(createTaskDto: CreateTaskDto, user) {
        const { name, startTime, endTime, cronTime, scriptId } = createTaskDto;
        const task = new Task();
        task.name = name;
        task.endTime = endTime;
        task.cronTime = cronTime;
        task.startTime = startTime;
        task.user = user;
        task.script = { id: scriptId };
        await this.taskRepository.save(task);
        return new HttpResponse({ showType: 1 });
    }

    async list({ params }, user) {
        const { current = 1, pageSize = 10 } = params;
        const [data, total] = await this.taskRepository.findAndCount({
            where: { user: { id: user.id } },
            take: pageSize,
            skip: (current - 1) * pageSize,
        });
        return new HttpResponse({ data, total });
    }

    async start(id: number, user) {
        const cronName = uuidv4();
        const task = await this.taskRepository.findOne({ where: { id, user } });
        if (!task) return new HttpResponse({ success: false, showType: 1 });
        const cronJob = new CronJob(task.cronTime, async () => {
            console.log('cronJob');
            let output = '';
            const envs = await this.envService.repository().find({ where: { task: { id }, user } });
            const script = await this.scriptService.repository().findOne({ where: { task: { id }, user } });
            envs.forEach((env) => {
                const cp = spawn('node', [script.filePath], {
                    env: {
                        ...process.env,
                        ...JSON.parse(env.processEnv),
                    },
                });
                cp.stdout.on('data', (data) => {
                    output += data.toString();
                });
                cp.stderr.on('data', (data) => {
                    output += `\x1b[31;1m${data}`;

                });
                cp.on('close', (code) => {
                    this.createLog({
                        taskId: id,
                        log: output,
                    });
                    output = '';
                });
            });
        });
        this.schedulerRegistry.addCronJob(cronName, cronJob);
        cronJob.start();
        task.status = 2;
        task.cronName = cronName;
        await this.taskRepository.save(task);
        return new HttpResponse({
            showType: 1,
        });
    }

    async stop(id: number, user) {
        const task = await this.taskRepository.findOne({ where: { id, user } });
        if (!task) return new HttpResponse({ success: false, showType: 1 });
        await this.schedulerRegistry.deleteCronJob(task.cronName);
        task.status = 1;
        task.cronName = null;
        await this.taskRepository.save(task);
        return new HttpResponse({
            showType: 1,
        });
    }

    findOne(id: number) {
        return `This action returns a #${id} task`;
    }

    update(id: number, updateTaskDto: UpdateTaskDto) {
        return `This action updates a #${id} task`;
    }

    async remove(id: number, user) {
        const envs = await this.envRepository.find({ where: { task: { id }, user } });
        if (envs) await this.envRepository.remove(envs);
        const taskLog = await this.taskLogRepository.find({ where: { task: { id } } });
        if(taskLog) await this.taskLogRepository.remove(taskLog)
        const task = await this.taskRepository.findOne({ where: { id, user } });
        if (!task) return new HttpResponse({ showType: 1, success: false });
        await this.taskRepository.remove(task);
        return new HttpResponse({ showType: 1 });
    }

    async createLog(createTaskDto) {
        const { log, taskId } = createTaskDto;
        const taskLog = new TaskLog();
        taskLog.log = log;
        taskLog.task = { id: taskId };
        await this.taskLogRepository.save(taskLog);
        return new HttpResponse();
    }

    async logList({ params }) {
        const { current = 1, pageSize = 10, taskId } = params;
        const [data, total] = await this.taskLogRepository.findAndCount({
            where: {
                task: { id: taskId },
            },
            take: pageSize,
            skip: (current - 1) * pageSize,
            order: {
                createTime: 'DESC'
            }
        });

        return new HttpResponse({
            data,
            total,
        });
    }
}

