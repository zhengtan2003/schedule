import { CronJob } from 'cron';
import * as dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import { spawn } from 'child_process';
import { Task } from '@/task/entities/task.entity';
import { HttpResponse } from '@/http-response';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskLog } from '@/task/entities/task-log.entity';
import { TaskEnv } from '@/task/entities/task-env.entity';
import { SchedulerRegistry } from '@nestjs/schedule';
import { UpsertTaskDto } from './dto/task.dto';
import { CreateTaskLogDto } from './dto/create-task-log.dto';
import { ScriptService } from '@/script/script.service';
import { searchOptions } from '@/utils';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(Task)
        private taskRepository: Repository<Task>,
        @InjectRepository(TaskLog)
        private taskLogRepository: Repository<TaskLog>,
        @InjectRepository(TaskEnv)
        private taskEnvRepository: Repository<TaskEnv>,
        private scriptService: ScriptService,
        private schedulerRegistry: SchedulerRegistry,
    ) {}

    async findOneTask(options, skipException = false) {
        const task = await this.taskRepository.findOne(options);
        if (!task && !skipException) {
            throw new NotFoundException('未找到任务');
        }
        return task;
    }

    async creat(upsertTaskDto: UpsertTaskDto, user) {
        const { scriptId, cronTime = '0 7 * * *' } = upsertTaskDto;
        const task = new Task();
        task.user = user;
        task.cronTime = cronTime;
        task.name = upsertTaskDto.name;
        task.script = { id: scriptId };
        await this.taskRepository.save(task);
        return new HttpResponse({ showType: 1 });
    }

    async update(upsertTaskDto: UpsertTaskDto, user) {
        const { id, cronTime = '0 7 * * *' } = upsertTaskDto;
        await this.taskRepository.update(
            {
                id: +id,
                user,
            },
            {
                cronTime,
                name: upsertTaskDto.name,
            },
        );
        return new HttpResponse({ showType: 1 });
    }

    async search(searchDto, user) {
        const [data, total] = await this.taskRepository.findAndCount(
            searchOptions(searchDto, { where: { user } }),
        );
        return new HttpResponse({ data, total });
    }

    async find(options) {
        const tasks = await this.taskRepository.find(options);
        return tasks ?? [];
    }

    async start(id: number, user) {
        const cronName = uuidv4();
        const task = await this.findOneTask({
            where: { id, user },
        });
        console.log(`开启任务：${cronName}，当前时间${new Date()}`);
        const cronJob = new CronJob(task.cronTime, () => {
            console.log(`执行任务：${cronName}`);
            this.debug(id, user);
        });
        this.schedulerRegistry.addCronJob(cronName, cronJob);
        cronJob.start();
        await this.taskRepository.update(
            {
                id,
                user,
            },
            {
                status: 2,
                cronName,
            },
        );
        return new HttpResponse({
            showType: 1,
        });
    }

    async stop(id: number, user) {
        const task = await this.findOneTask({ where: { id, user } });
        console.log(`停止定时任务：${task.cronName}，${task.cronTime}`);
        try {
            await this.schedulerRegistry.deleteCronJob(task.cronName);
        } catch (e) {}
        task.status = 1;
        task.cronName = null;
        await this.taskRepository.save(task);
        return new HttpResponse({
            showType: 1,
        });
    }

    async debug(id: number, user, needResponse?: boolean) {
        const task = await this.findOneTask({
            relations: ['env', 'script'],
            where: { id, user },
        });
        let log = '';
        let statusLog = 1;
        const script = task.script;
        const envs = task.env;
        envs.forEach((env) => {
            const cp = spawn(`node ${script.filePath}`, {
                shell: true,
                env: {
                    ...process.env,
                    ...dotenv.parse(env.code),
                },
            });
            cp.stdout.on('data', (data) => {
                log += `${data}`;
            });
            cp.stderr.on('data', (data) => {
                log += `${data}`;
                statusLog = 0;
            });
            cp.on('close', () => {
                this.createLog({
                    log,
                    taskId: id,
                    status: statusLog,
                });
                log = '';
                console.log(`任务执行结束：${task.cronName}`);
            });
        });
        if (needResponse) {
            return new HttpResponse({
                showType: 1,
                message: '任务执行成功，稍后可在日志中查看结果',
            });
        }
    }

    async remove(id: number, user) {
        const task = await this.findOneTask({
            where: { id, user },
            relations: ['env', 'log'],
        });
        if (task.env.length) {
            await this.taskEnvRepository.remove(task.env);
        }
        if (task.log.length) {
            await this.taskLogRepository.remove(task.log);
        }
        if (task.cronName) {
            await this.schedulerRegistry.deleteCronJob(task.cronName);
        }
        await this.taskRepository.remove(task);
        return new HttpResponse({ showType: 1 });
    }

    async retrieve(id: number, user) {
        if (!id) return {};
        const task = await this.findOneTask({
            where: { id, user },
            relations: ['script'],
        });
        return {
            name: task.name,
            cronTime: task.cronTime,
            scriptId: task.script.id,
        };
    }

    //env
    async findOneEnv(options, skipException = false) {
        const taskEnv = await this.taskEnvRepository.findOne(options);
        if (!taskEnv && !skipException) {
            throw new NotFoundException('未找到此任务的相关的env');
        }
        return taskEnv;
    }

    async creatEnv(upsertTaskEnvDto, user) {
        const { code, taskId, description } = upsertTaskEnvDto;
        const task = new Task();
        task.id = taskId;
        const env = new TaskEnv();
        env.code = code;
        env.user = user;
        env.task = task;
        env.description = description;
        await this.taskEnvRepository.save(env);
        return new HttpResponse({ showType: 1 });
    }

    async updateEnv(upsertTaskEnvDto, user) {
        const { id, taskId, code, description } = upsertTaskEnvDto;
        const task = new Task();
        task.id = taskId;
        const env = await this.findOneEnv({
            where: { id, task, user },
        });
        env.code = code;
        env.description = description;
        await this.taskEnvRepository.save(env);
        return new HttpResponse({ showType: 1 });
    }

    async removeEnv(removeTaskEnvDto, user) {
        const { id, taskId } = removeTaskEnvDto;
        const task = new Task();
        task.id = taskId;
        const env = await this.findOneEnv({
            where: { id, task, user },
        });
        await this.taskEnvRepository.remove(env);
        return new HttpResponse({ showType: 1 });
    }

    async envSearch(searchDto, user) {
        const [data, total] = await this.taskEnvRepository.findAndCount(
            searchOptions(searchDto, {
                where: { task: { id: searchDto.params.taskId }, user },
            }),
        );
        return new HttpResponse({ data, total });
    }

    async envRetrieve({ id, taskId }, user) {
        if (!id) return {};
        const task = new Task();
        task.id = taskId;
        const env = await this.findOneEnv({ where: { id, task, user } }, true);
        return {
            code: env.code,
            description: env.description,
        };
    }

    //log
    async createLog(createTaskDto: CreateTaskLogDto) {
        const { log, taskId, status } = createTaskDto;
        const taskLog = new TaskLog();
        taskLog.log = log;
        taskLog.status = status;
        taskLog.task = { id: taskId };
        await this.taskLogRepository.save(taskLog);
        return new HttpResponse();
    }

    async logSearch(searchDto) {
        const [data, total] = await this.taskLogRepository.findAndCount(
            searchOptions(searchDto, {
                where: { task: { id: searchDto.params.taskId } },
            }),
        );
        return new HttpResponse({
            data,
            total,
        });
    }

    async removeAllLog(taskId, user) {
        const task = await this.findOneTask({
            where: { id: taskId, user },
            relations: ['log'],
        });
        await this.taskLogRepository.remove(task.log);
        return new HttpResponse();
    }
}
