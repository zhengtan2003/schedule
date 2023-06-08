import * as path from 'path';
import { CronJob } from 'cron';
import * as dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import { spawn } from 'child_process';
import parser from 'cron-parser';
import { Task } from '@/task/entities/task.entity';
import { HttpResponse } from '@/http-response';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskLog } from '@/task/entities/task-log.entity';
import { TaskEnv } from '@/task/entities/task-env.entity';
import { SchedulerRegistry } from '@nestjs/schedule';
import { UpsertTaskDto } from './dto/task.dto';
import { CreateTaskLogDto } from './dto/create-task-log.dto';
import { ScriptService } from '@/script/script.service';
import {
    searchOptions,
    unlinkSync,
    writeFileSync,
    readFileSync,
} from '@/utils';
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

    async upsert(upsertTaskDto: UpsertTaskDto, user) {
        const { id, scriptId, cronTime = '0 7 * * *' } = upsertTaskDto;
        const task = !id
            ? new Task()
            : await this.findOneTask({
                  where: { id, user },
              });
        task.cronTime = cronTime;
        task.name = upsertTaskDto.name;
        // task.endTime = upsertTaskDto.endTime;
        // task.startTime = upsertTaskDto.startTime;
        task.user = user;
        task.script = { id: scriptId };
        await this.taskRepository.save(task);
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
        const cronJob = new CronJob(task.cronTime, () =>
            this.performTask(id, user),
        );
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

    async performTask(id, user, type?: string) {
        const task = await this.findOneTask({
            relations: ['env', 'script'],
            where: { id, user },
        });
        let log = '';
        let statusLog = 1;
        const script = task.script;
        const envs = task.env;
        envs.forEach((env) => {
            const cp = spawn('node', [script.filePath], {
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
                    type,
                    taskId: id,
                    status: statusLog,
                });
                log = '';
            });
        });
    }

    debug(id: number, user) {
        this.performTask(id, user, 'debug');
        return new HttpResponse({
            showType: 1,
            message: '任务执行成功，稍后可在日志中查看结果',
        });
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
        const { log, taskId, status, type } = createTaskDto;
        const taskLog = new TaskLog();
        taskLog.log = log;
        taskLog.type = type;
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

    async schemaForm(taskId, user) {
        const task = await this.findOneTask({
            where: { id: taskId, user },
            relations: ['script'],
        });
        const { columns } = JSON.parse(task.script?.schemaForm);
        return {
            columns: JSON.parse(columns),
        };
        // try {
        //
        // } catch (e) {
        //     return {};
        // }
    }
}
