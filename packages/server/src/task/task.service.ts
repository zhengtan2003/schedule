import { HttpResponse } from '@/http-response';
import { ScriptService } from '@/script/script.service';
import { TaskLogService } from '@/task-log/task-log.service';
import { Task } from '@/task/entities/task.entity';
import { searchOptions } from '@/utils';
import { Injectable, NotFoundException } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { spawn } from 'child_process';
import { CronJob } from 'cron';
import * as dotenv from 'dotenv';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { UpsertTaskDto } from './dto/task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private scriptService: ScriptService,
    private schedulerRegistry: SchedulerRegistry,
    private taskLogService: TaskLogService,
  ) {}

  async findOne(options, skipException = false) {
    const task = await this.taskRepository.findOne(options);
    if (!task && !skipException) {
      throw new NotFoundException('未找到任务');
    }
    return task;
  }

  async creat(upsertTaskDto: UpsertTaskDto, user) {
    const { scriptId, ...retDto } = upsertTaskDto;
    const task = await this.taskRepository.create({
      ...retDto,
      user,
      script: { id: scriptId },
    });
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
    const task = await this.findOne({
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

  async debug(id: number, user, needResponse?: boolean) {
    const task = await this.findOne({
      relations: ['taskEnv', 'script'],
      where: { id, user },
    });
    let log = '';
    let statusLog: 0 | 1 = 1;
    const script = task.script;
    const envs = task.taskEnv;
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
        console.log('log', log);
        this.taskLogService.create(
          {
            log,
            taskId: id,
            status: statusLog,
          },
          user,
        );
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
    const task = await this.findOne({
      where: { id, user },
    });
    if (task.cronName) {
      await this.schedulerRegistry.deleteCronJob(task.cronName);
    }
    await this.taskRepository.remove(task);
    return new HttpResponse({ showType: 1 });
  }

  async from(id: number, user) {
    if (!id) return {};
    const task = await this.findOne({
      where: { id, user },
      relations: ['script'],
    });
    if (!task) return {};
    return {
      name: task.name,
      cronTime: task.cronTime,
      scriptId: task.script.id,
    };
  }
}
