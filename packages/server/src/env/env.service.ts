import { OptionsDto } from '@/env/dto/options.dto';
import { HttpResponse } from '@/http-response';
import { searchOrder, searchParams } from '@/utils';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpsertTaskEnvDto } from './dto/env.dto';
import { Env } from './entities/env.entity';

@Injectable()
export class EnvService {
  constructor(
    @InjectRepository(Env)
    private readonly envRepository: Repository<Env>,
  ) {}

  async findOne(options, skipException = false) {
    const taskEnv = await this.envRepository.findOne(options);
    if (!taskEnv && !skipException) {
      throw new NotFoundException('未找到此任务的相关的env');
    }
    return taskEnv;
  }

  async create(createTaskEnvDto: UpsertTaskEnvDto, user) {
    const { taskId, ...retDto } = createTaskEnvDto;
    const env = this.envRepository.create({
      ...retDto,
      task: { id: taskId },
      user,
    });
    await this.envRepository.save(env);
    return new HttpResponse({ showType: 1 });
  }

  async update(updateTaskEnvDto: UpsertTaskEnvDto, user?: any) {
    const { id, taskId, ...retDto } = updateTaskEnvDto;
    await this.envRepository.update({ id, task: { id: taskId }, user }, retDto);
    return new HttpResponse({ showType: 1 });
  }

  async remove(id, user) {
    await this.envRepository.delete({ id, user });
    return new HttpResponse({ showType: 1 });
  }

  async search(taskId, searchDto, user) {
    const { current = 1, pageSize = 10, ...retParams } = searchDto.params;
    const where = searchParams(retParams);
    const order = searchOrder(searchDto.sort);
    const [data, total] = await this.envRepository.findAndCount({
      order,
      take: pageSize,
      skip: (current - 1) * pageSize,
      where: { ...where, task: { id: taskId }, user },
    });
    return new HttpResponse({ data, total });
  }

  async form(id: number, user) {
    if (!id) return {};
    const env = await this.findOne({ where: { id, user } }, true);
    if (!env) return {};
    return {
      code: env.code,
      description: env.description,
    };
  }

  async options(optionsDto: OptionsDto, user) {
    const where = { user };
    if (!isNaN(optionsDto.taskId)) {
      where['task'] = { id: optionsDto.taskId };
    }
    const envs = await this.envRepository.findBy(where);
    if (!envs) return [];
    return envs.map(({ description, id }) => ({
      label: description,
      value: id,
    }));
  }
}
