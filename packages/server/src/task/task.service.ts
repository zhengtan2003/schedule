import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Task} from './task.entity';
import {Repository} from 'typeorm';
import {toISOString} from '../utils';
import {spawn} from 'child_process';
import {CronJob} from 'cron';
import type {FindManyOptions} from "typeorm";
import {EnvService} from '../env/env.service';
import {SchedulerRegistry} from '@nestjs/schedule';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(Task)
        private taskRepository: Repository<Task>,
        private envService: EnvService,
        private schedulerRegistry: SchedulerRegistry,
    ) {
    }

    find(options?: FindManyOptions<Task>) {
        return this.taskRepository.find(options);
    }

    async upsert({id, fileName, code, updateURL}: any, {user}) {
        // const hasScript = await this.repository.findOne({ where: { name } });
        // if (hasScript) {
        //   throw new ConflictException('此脚本已存在');
        // }
        const regex = /\/\/\s*@(\w+)\s+(.*)/g;
        const matches = code.matchAll(regex);
        const metadata: any = {};
        for (const match of matches) {
            const [, key, value] = match;
            metadata[key] = value;
        }
        const task = new Task();
        task.id = id;
        task.name = metadata.name ?? fileName;
        task.code = code;
        task.user = user.id;
        task.updateURL = updateURL;
        task.cronTime = metadata.cronTime;
        task.version = metadata.version;
        task.description = metadata.description;
        task.startTime = toISOString(metadata.startTime);
        task.endTime = toISOString(metadata.endTime);
        await this.taskRepository.save(task);
        return {
            showType: 1,
            msg: !!id ? '任务更新成功' : '任务创建成功'
        }
        // await this.addCronJob(id);
    }

    async get(id) {
        const data = await this.taskRepository.findOne({where: {id}});
        if (!data) {
            throw new NotFoundException();
        }
        return {data};
    }

    async delete(id, {user}) {
        const envs = await this.envService.find({task: {id}, user: {id: user.id}});
        await this.envService.remove(envs);
        const task = await this.taskRepository.findOne({where: {id}});
        if (!task) {
            throw new NotFoundException('未找到此任务');
        }
        await this.taskRepository.remove(task);
        return {
            showType: 1
        }
    }

    async search({params, filter, sort}, {user}) {
        const {current = 1, pageSize = 10} = params || {};
        const [data, total] = await this.taskRepository.findAndCount({
            where: {
                user: {id: user.id},
            },
            take: pageSize,
            skip: (current - 1) * pageSize,
        });
        return {
            data,
            total,
        };
    }

    async start(id, {user}) {
        const taskName = `cron_task_${user.id}_${id}`;
        const envs = await this.envService.find({task: {id}, user: {id: user.id}});
        const task = await this.taskRepository.findOne({where: {id, user: {id: user.id}}});
        const cronJob = new CronJob(task.cronTime, async () => {
            envs.forEach((env) => {
                const cp = spawn('node', ['-e', task.code], {
                    env: {
                        ...process.env,
                        ...JSON.parse(env.processEnv),
                    },
                });
                cp.stdout.on('data', (data) => {
                    console.log(`stdout: ${data}`);
                });
                cp.stderr.on('data', (data) => {
                    console.error(`stderr: ${data}`);
                });
                cp.on('close', (code) => {
                    console.log(`脚本执行结束，退出码：${code}`);
                });
            });
        });
        this.schedulerRegistry.addCronJob(taskName, cronJob);
        cronJob.start();
        if (task.status !== "processing") {
            task.status = "processing";
            await this.taskRepository.save(task)
        }
        return {
            showType: 1
        }
    }

    async stop(id, {user}) {
        await this.schedulerRegistry.deleteCronJob(`cron_task_${user.id}_${id}`);
        const task = await this.taskRepository.findOne({where: {id, user: {id: user.id}}});
        task.status = "waiting";
        await this.taskRepository.save(task);
        return {
            showType: 1
        }
    }
}
