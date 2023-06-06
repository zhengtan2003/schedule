import { CronJob } from 'cron';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import { spawn } from 'child_process';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { HttpResponse } from '@/http-response';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskLog } from './entities/task-log.entity';
import { TaskEnv } from './entities/task-env.entity';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CreateTaskDto } from './dto/create-task.dto';
import { CreateTaskLogDto } from './dto/create-task-log.dto';
import { ScriptService } from '@/script/script.service';
import { searchOptions, unlinkSync, writeFileSync } from '@/utils';
import * as path from 'path';
import { readFileSync } from '@/utils/read-file-sync';
import * as dotenv from 'dotenv';

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
            relations: ['env'],
            where: { id, user },
        });
        const envs = task.env;
        if (!envs.length) {
            return new HttpResponse({
                showType: 2,
                success: false,
                message: '请添加.env后再开始任务',
            });
        }
        console.log(`开启定时任务：${cronName}，${task.cronTime}`);
        const cronJob = new CronJob(task.cronTime, () => {
            console.log(`任务执行中：${task.cronName}，${task.cronTime}`);
            this.spawn(id, user);
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

    async debug(id: number, user) {
        const task = await this.findOneTask({
            relations: ['env'],
            where: { id, user },
        });
        if (!task.env.length) {
            return new HttpResponse({
                showType: 2,
                success: false,
                message: '请添加.env后再开始任务',
            });
        }
        this.spawn(id, user, 'debug');
        return new HttpResponse({
            showType: 1,
            message: '任务执行成功，稍后可在日志中查看结果',
        });
    }

    async spawn(id, user, type?: string) {
        const task = await this.findOneTask({
            relations: ['env', 'script'],
            where: { id, user },
        });
        let output = '';
        const statusArray = [];
        const envs = task.env;
        const script = task.script as any;
        envs.forEach((env) => {
            const cp = spawn('node', [script.filePath], {
                env: {
                    ...process.env,
                    ...dotenv.parse(readFileSync(env.filePath)),
                },
            });
            cp.stdout.on('data', (data) => {
                output += `${data}`;
                statusArray.push(true);
            });
            cp.stderr.on('data', (data) => {
                output += `${data}`;
                statusArray.push(false);
            });
            cp.on('close', () => {
                let status = 'warning';
                if (statusArray.every((t) => t === true)) {
                    status = 'success';
                } else if (statusArray.every((t) => t === false)) {
                    status = 'error';
                }
                this.createLog({
                    type,
                    status,
                    taskId: id,
                    log: output,
                });
                output = '';
            });
        });
    }

    async remove(id: number, user) {
        const task = await this.findOneTask({
            where: { id, user },
            relations: ['env', 'log'],
        });
        await Promise.all(task.env.map((env) => unlinkSync(env.filePath)));
        await this.taskEnvRepository.remove(task.env);
        await this.taskLogRepository.remove(task.log);
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
        const { code, taskId, remark } = upsertTaskEnvDto;
        const env = new TaskEnv();
        env.remark = remark;
        env.user = user;
        env.task = { id: taskId };
        env.filePath = path.join(
            'assets',
            'files',
            `${user.id}`,
            'envs',
            `${Date.now()}`,
            `.env`,
        );
        writeFileSync(env.filePath, code);
        await this.taskEnvRepository.save(env);
        return new HttpResponse({ showType: 1 });
    }

    async updateEnv(upsertTaskEnvDto, user) {
        const { id, taskId, code, remark } = upsertTaskEnvDto;
        const env = await this.findOneEnv({
            where: { id, task: { id: taskId }, user },
        });
        env.remark = remark;
        writeFileSync(env.filePath, code);
        await this.taskEnvRepository.save(env);
        return new HttpResponse({ showType: 1 });
    }

    async removeEnv(removeTaskEnvDto, user) {
        const { id, taskId } = removeTaskEnvDto;
        const env = await this.findOneEnv({
            where: { id, task: { id: taskId }, user },
        });
        unlinkSync(env.filePath);
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

    async envAntdFrom({ id, taskId }, user) {
        if (!id) return {};
        const env = await this.findOneEnv(
            { where: { id, task: { id: taskId }, user } },
            true,
        );
        const code = readFileSync(env.filePath);
        return {
            code,
            remark: env.remark,
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
}
