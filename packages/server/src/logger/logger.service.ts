import { HttpResponse } from '@/http-response';
import { searchOrder, searchParams } from '@/utils';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoggerDto } from './dto/Logger.dto';
import { Logger } from './entities/logger.entity';

@Injectable()
export class LoggerService {
  constructor(
    @InjectRepository(Logger)
    private loggerRepository: Repository<Logger>,
  ) {}

  async create(logDto: LoggerDto, user) {
    const { taskId, envId, ...retDto } = logDto;
    const taskLog = await this.loggerRepository.create({
      ...retDto,
      user,
      env: { id: envId },
      task: { id: taskId },
    });
    await this.loggerRepository.save(taskLog);
    return new HttpResponse();
  }

  async remove(envId, user) {
    const taskLogs = await this.loggerRepository.find({
      where: { env: { id: envId }, user: { id: user.id } },
    });
    await this.loggerRepository.remove(taskLogs);
    return new HttpResponse();
  }

  async search(searchDto, user) {
    const {
      current = 1,
      pageSize = 10,
      envId,
      ...retParams
    } = searchDto.params;
    const where = searchParams(retParams);
    const order = searchOrder(searchDto.sort);
    const [data, total] = await this.loggerRepository.findAndCount({
      order,
      take: pageSize,
      skip: (current - 1) * pageSize,
      where: { ...where, env: { id: envId }, user },
    });
    return new HttpResponse({ data, total });
  }
}
