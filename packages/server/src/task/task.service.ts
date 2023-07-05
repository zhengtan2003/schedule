import { EnvService } from '@/env/env.service';
import { HttpResponse } from '@/http-response';
import { LoggerService } from '@/logger/logger.service';
import { ScriptService } from '@/script/script.service';
import { CreateTaskDto } from '@/task/dto/creat-task.dto';
import { SyncScripDto } from '@/task/dto/sync-scrip.dto';
import { UpdateScripExtDto } from '@/task/dto/update-scrip-ext.dto';
import { UpdateTaskDto } from '@/task/dto/update-task.dto';
import { Task } from '@/task/entities/task.entity';
import { searchOptions } from '@/utils';
import { Injectable, NotFoundException } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { spawn } from 'child_process';
import { CronJob } from 'cron';
import { In, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

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

  async creat(upsertTaskDto: CreateTaskDto, user) {
    // const { scriptIds, scriptsExt } = upsertTaskDto.scripts.reduce(
    //   (result, { id, cronTime }) => {
    //     result.scriptsExt[id] = { id, cronTime };
    //     result.scriptIds.push(id);
    //     return result;
    //   },
    //   { scriptIds: [], scriptsExt: {} },
    // );
    // const scripts = await this.scriptService.repository.findBy({
    //   id: In(scriptIds),
    //   user,
    // });
    const task = await this.taskRepository.create({
      ...upsertTaskDto,
      user,
      // scriptsExt,
      // scripts,
    });
    await this.taskRepository.save(task);
    return new HttpResponse({ data: task });
  }

  async update(updateTaskDto: UpdateTaskDto, user) {
    const { id, ...retDto } = updateTaskDto;
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

  async toggle(id, user) {
    const task = await this.findOne({
      where: { id, user },
    });
    if (task.status === 0) return this.start(task, user);
    if (task.status === 1) return this.stop(task);
  }

  async start(task: Task, user) {
    const id = task.id;
    task.status = 1;
    Object.values(task.scriptsExt).forEach((ext) => {
      ext.cronName = uuidv4();
      const cronJob = new CronJob(ext.cronTime, async () => {
        const task = await this.findOne({
          where: { id },
          relations: ['scripts', 'envs'],
        });
        const script = task.scripts.find(({ id }) => id == ext.id);
        task.envs.forEach((env) => {
          let outLog = '';
          const startTime = Date.now();
          const cp = spawn(`${script.startCommand} ${script.filePath}`, {
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
            outLog += `${bufferData}`;
          });
          cp.on('close', () => {
            this.loggerService.create(
              {
                log: outLog,
                envId: env.id,
                taskId: task.id,
                executionTime: (Date.now() - startTime) / 1000,
              },
              user,
            );
            outLog = '';
          });
        });
      });
      this.schedulerRegistry.addCronJob(ext.cronName, cronJob);
      cronJob.start();
    });
    await this.taskRepository.save(task);
    return new HttpResponse({
      showType: 1,
    });
  }

  async stop(task: Task) {
    task.status = 0;
    const exts = Object.values(task.scriptsExt);
    for (let i = 0; i < exts.length; i++) {
      try {
        await this.schedulerRegistry.deleteCronJob(exts[i].cronName);
      } catch (e) {}
      delete exts[i].cronName;
    }
    await this.taskRepository.save(task);
    return new HttpResponse({
      showType: 1,
    });
  }

  async remove(id: number, user) {
    const task = await this.findOne({
      where: { id, user },
    });
    // if (this.schedulerRegistry.doesExist('cron', task.cronName)) {
    //   this.schedulerRegistry.deleteCronJob(task.cronName);
    // }
    await this.taskRepository.remove(task);
    return new HttpResponse({ showType: 1 });
  }

  async from(id: number, user) {
    if (!id) return {};
    const task = await this.findOne({
      where: { id, user },
    });
    if (!task) return {};
    return {
      name: task.name,
    };
  }

  async script(id: number, user) {
    if (!id) return new HttpResponse({ success: false, data: [] });
    const task = await this.findOne({
      where: { id, user },
      relations: ['scripts'],
    });
    if (!task) return new HttpResponse({ success: false, data: [] });
    const data = task.scripts.map((script) => {
      const { cronTime = '0 7 * * *' } = task.scriptsExt[script.id];
      return {
        ...script,
        cronTime,
      };
    });
    return new HttpResponse({ data, total: data.length });
  }

  async details(id: number, user) {
    if (!id) return new HttpResponse({ success: false });
    const task = await this.findOne({
      where: { id, user },
    });
    return new HttpResponse({ data: task });
  }

  async syncScrip(syncScripDto: SyncScripDto, user) {
    const { id, scriptIds } = syncScripDto;
    const scripts = await this.scriptService.repository.findBy({
      id: In(scriptIds),
      user,
    });
    const task = await this.findOne({ where: { id, user } });
    task.scriptsExt = scriptIds.reduce((scriptsExt, id) => {
      scriptsExt[id] = { id, cronTime: '0 7 * * *' };
      return scriptsExt;
    }, {});
    task.scripts = scripts;
    await this.taskRepository.save(task);
    return new HttpResponse();
  }

  async updateScripExt(updateScripExtDto: UpdateScripExtDto, user) {
    const { id, scriptId, cronTime } = updateScripExtDto;
    const task = await this.findOne({ where: { id, user } });
    task.scriptsExt[scriptId].id = scriptId;
    task.scriptsExt[scriptId].cronTime = cronTime;
    await this.taskRepository.save(task);
    return new HttpResponse();
  }
}
