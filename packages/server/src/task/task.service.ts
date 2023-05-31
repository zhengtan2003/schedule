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
import * as fs from 'fs';
import * as path from 'path';

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

    commentParser(comment: string) {
        const regex = /\/\/\s*@(\w+)\s+(.*)/g;
        const matches = comment.matchAll(regex);
        const metadata: any = {};
        for (const match of matches) {
            const [, key, value] = match;
            metadata[key] = value;
        }
        return metadata
    }

    saveFile({code, filename, user}) {
        const uploadDir = path.join(__dirname, 'script', `${user.id}`, `${Date.now()}`);
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, {recursive: true});
        }
        const targetPath = path.join(uploadDir, filename)
        const writeStream = fs.createWriteStream(targetPath);
        writeStream.write(code);
        writeStream.end();
        return targetPath;
    }

    async upsert({id, filename, code, updateURL}: any, {user}) {
        const filePath = this.saveFile({code, filename, user})
        const regex = /\/\/\s*@(\w+)\s+(.*)/g;
        const matches = code.matchAll(regex);
        const metadata: any = {};
        for (const match of matches) {
            const [, key, value] = match;
            metadata[key] = value;
        }
        const task = new Task();
        task.id = id;
        task.user = user.id;
        task.filePath = filePath;
        task.version = metadata.version;
        task.cronTime = metadata.cronTime;
        task.name = metadata.name ?? filename;
        task.description = metadata.description;
        task.endTime = toISOString(metadata.endTime);
        task.startTime = toISOString(metadata.startTime);
        task.updateURL = metadata.updateURL ?? updateURL;
        await this.taskRepository.save(task);
        return {
            showType: 1,
            message: !!id ? '任务更新成功' : '任务创建成功'
        }
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
        const task = await this.taskRepository.findOne({where: {id, user: {id: user.id}}});
        if (!task) {
            throw new NotFoundException('未找到此任务');
        }
        if (task.status === "processing") {
            const cronName = this.getCronName(user.id, id);
            await this.schedulerRegistry.deleteCronJob(cronName);
        }
        fs.unlink(task.filePath, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
            } else {
                console.log('File deleted successfully');
            }
        });
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

    getCronName(userId, taskId) {
        return `cron_task_${userId}_${taskId}`
    }

    async start(id, {user}) {
        const cronName = this.getCronName(user.id, id);
        const task = await this.taskRepository.findOne({where: {id, user: {id: user.id}}});
        const cronJob = new CronJob(task.cronTime, async () => {
            const envs = await this.envService.find({task: {id}, user: {id: user.id}});
            envs.forEach((env) => {
                const cp = spawn('node', [task.filePath], {
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
        this.schedulerRegistry.addCronJob(cronName, cronJob);
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
