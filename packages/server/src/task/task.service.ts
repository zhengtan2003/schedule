import { EnvService } from '@/env/env.service';
import { HttpResponse } from '@/http-response';
import { LoggerService } from '@/logger/logger.service';
import { ScriptService } from '@/script/script.service';
import { Task } from '@/task/entities/task.entity';
import { getStartCommand, searchOptions } from '@/utils';
import { Injectable, NotFoundException } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { spawn } from 'child_process';
import { CronJob } from 'cron';
import * as process from 'process';
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
    private loggerService: LoggerService,
    private envService: EnvService,
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
    const { id, scriptId, ...retDto } = upsertTaskDto;
    const task = await this.findOne({ where: { id, user } });
    if (
      retDto.cronTime !== task.cronTime &&
      task.cronName &&
      this.schedulerRegistry.doesExist('cron', task.cronName)
    ) {
      this.schedulerRegistry.deleteCronJob(task.cronName);
      this.cronLaunch(
        {
          cronTime: retDto.cronTime,
          cronName: task.cronName,
          id,
        },
        user,
      );
    }
    await this.taskRepository.update(
      {
        id,
        user,
      },
      retDto,
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

  spawn({ task, env }, user) {
    let outLog = '';
    let statusLog: 0 | 1 = 1;
    const startTime = Date.now();
    const startCommand = getStartCommand(task.script.language);
    const cp = spawn(`${startCommand} ${task.script.filePath}`, {
      shell: true,
      env: {
        ...process.env,
        ...JSON.parse(env.code),
      },
    });
    cp.stdout.on('data', (bufferData) => {
      const data = `${bufferData}`.trim();
      const regex = /@(\w+)=>/;
      const matchArray = data.match(regex);
      if (matchArray) {
        const key = matchArray[1];
        const codeParsed = JSON.parse(env.code);
        codeParsed[key] = data.replace(regex, '');
        this.envService.update(
          {
            id: env.id,
            taskId: task.id,
            code: JSON.stringify(codeParsed, null, 2),
          },
          user,
        );
      } else {
        outLog += `${bufferData}`;
      }
    });
    cp.stderr.on('data', (bufferData) => {
      statusLog = 0;
      outLog += `${bufferData}`;
    });
    cp.on('close', () => {
      this.loggerService.create(
        {
          log: outLog,
          envId: env.id,
          taskId: task.id,
          status: statusLog,
          executionTime: (Date.now() - startTime) / 1000,
        },
        user,
      );
      outLog = '';
    });
  }

  async debug({ taskId, envId, onStdout, onStderr, onClose }: any, user) {
    const task = await this.findOne({
      relations: ['script'],
      where: { id: taskId, user },
    });
    const env = await this.envService.findOne({ where: { id: envId } });
    // this.spawn(
    //   {
    //     task,
    //     env,
    //     onStdout,
    //     onStderr,
    //     onClose,
    //   },
    //   user,
    // );
    return new HttpResponse();
  }

  cronLaunch({ cronName, cronTime, id }, user) {
    const cronJob = new CronJob(cronTime, async () => {
      const task = await this.findOne({
        relations: ['env', 'script'],
        where: { id, user },
      });
      task.env.forEach((env) => this.spawn({ task, env }, user));
    });
    this.schedulerRegistry.addCronJob(cronName, cronJob);
    cronJob.start();
  }

  async start(toggleDto, user) {
    const { cronTime, id } = toggleDto;
    const cronName = uuidv4();
    this.cronLaunch({ cronName, cronTime, id }, user);
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

  async stop(toggleDto, user) {
    const { cronName, id } = toggleDto;
    try {
      await this.schedulerRegistry.deleteCronJob(cronName);
    } catch (e) {}
    await this.taskRepository.update(
      {
        id,
        user,
      },
      {
        status: 1,
        cronName: null,
      },
    );
    return new HttpResponse({
      showType: 1,
    });
  }

  async remove(id: number, user) {
    const task = await this.findOne({
      where: { id, user },
    });
    if (this.schedulerRegistry.doesExist('cron', task.cronName)) {
      this.schedulerRegistry.deleteCronJob(task.cronName);
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
