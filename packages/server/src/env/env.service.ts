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
    private readonly taskEnvRepository: Repository<Env>,
  ) {}

  async findOne(options, skipException = false) {
    const taskEnv = await this.taskEnvRepository.findOne(options);
    if (!taskEnv && !skipException) {
      throw new NotFoundException('未找到此任务的相关的env');
    }
    return taskEnv;
  }

  async create(createTaskEnvDto: UpsertTaskEnvDto, user) {
    const { taskId, ...retDto } = createTaskEnvDto;
    const env = this.taskEnvRepository.create({
      ...retDto,
      task: { id: taskId },
      user,
    });
    await this.taskEnvRepository.save(env);
    return new HttpResponse({ showType: 1 });
  }

  async update(updateTaskEnvDto: UpsertTaskEnvDto, user) {
    const { id, taskId, ...retDto } = updateTaskEnvDto;
    await this.taskEnvRepository.update(
      { id, task: { id: taskId }, user },
      retDto,
    );
    return new HttpResponse({ showType: 1 });
  }

  async remove(id, user) {
    await this.taskEnvRepository.delete({ id, user });
    return new HttpResponse({ showType: 1 });
  }

  async search(searchDto, user) {
    const {
      current = 1,
      pageSize = 10,
      taskId,
      ...retParams
    } = searchDto.params;
    const where = searchParams(retParams);
    const order = searchOrder(searchDto.order);
    const [data, total] = await this.taskEnvRepository.findAndCount({
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
}
