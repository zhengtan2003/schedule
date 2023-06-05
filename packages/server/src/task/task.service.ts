import { CronJob } from 'cron';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import { spawn } from 'child_process';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { HttpResponse } from '@/http-response';
import { EnvService } from '@/env/env.service';
import { Env } from '@/env/entities/env.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskLog } from './entities/task-log.entity';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskLogDto } from './dto/create-task-log.dto';
import { ScriptService } from '@/script/script.service';
import { searchOptions } from '@/utils';

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
    ) {}

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

    async findOne(options, skipException = false) {
        const task = await this.taskRepository.findOne(options);
        if (!task && !skipException) {
            throw new NotFoundException('未找到任务');
        }
        return task;
    }

    async find(options) {
        const tasks = await this.taskRepository.find(options);
        return tasks ?? [];
    }

    async start(id: number, user) {
        const cronName = uuidv4();
        const task = await this.findOne({ where: { id, user } });
        console.log(`开启定时任务：${cronName}，${task.cronTime}`);
        const cronJob = new CronJob(task.cronTime, async () => {
            console.log(`任务执行中：${task.cronName}，${task.cronTime}`);
            let output = '';
            const statusArray = [];
            const envs = await this.envService
                .repository()
                .find({ where: { task: { id }, user } });
            const script = await this.scriptService.findOne({
                where: { task: { id }, user },
            });
            envs.forEach((env) => {
                const cp = spawn('node', [script.filePath], {
                    env: {
                        ...process.env,
                        ...JSON.parse(env.processEnv),
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
                        taskId: id,
                        log: output,
                        status,
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
        const task = await this.findOne({ where: { id, user } });
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

    update(id: number, updateTaskDto: UpdateTaskDto) {
        return `This action updates a #${id} task`;
    }

    async remove(id: number, user) {
        const envs = await this.envRepository.find({
            where: { task: { id }, user },
        });
        if (envs) await this.envRepository.remove(envs);
        const taskLog = await this.taskLogRepository.find({
            where: { task: { id } },
        });
        if (taskLog) await this.taskLogRepository.remove(taskLog);
        const task = await this.taskRepository.findOne({ where: { id, user } });
        if (!task) return new HttpResponse({ showType: 1, success: false });
        await this.taskRepository.remove(task);
        return new HttpResponse({ showType: 1 });
    }

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
}
