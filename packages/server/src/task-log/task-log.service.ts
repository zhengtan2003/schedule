import { HttpResponse } from '@/http-response';
import { searchOrder, searchParams } from '@/utils';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpsertTaskLogDto } from './dto/upsert-task-log.dto';
import { TaskLog } from './entities/task-log.entity';

@Injectable()
export class TaskLogService {
  constructor(
    @InjectRepository(TaskLog)
    private taskLogRepository: Repository<TaskLog>,
  ) {}

  async create(createTaskLogDto: UpsertTaskLogDto, user) {
    const { taskId, ...retDto } = createTaskLogDto;
    const taskLog = await this.taskLogRepository.create({
      ...retDto,
      user,
      task: { id: taskId },
    });
    await this.taskLogRepository.save(taskLog);
    return new HttpResponse();
  }

  async remove(taskId, user) {
    const taskLogs = await this.taskLogRepository.find({
      where: { task: { id: taskId }, user: { id: user.id } },
    });
    await this.taskLogRepository.remove(taskLogs);
    return new HttpResponse();
  }

  async search(searchDto, user) {
    const {
      current = 1,
      pageSize = 10,
      taskId,
      ...retParams
    } = searchDto.params;
    const where = searchParams(retParams);
    const order = searchOrder(searchDto.sort);
    const [data, total] = await this.taskLogRepository.findAndCount({
      order,
      take: pageSize,
      skip: (current - 1) * pageSize,
      where: { ...where, task: { id: taskId } },
    });
    return new HttpResponse({ data, total });
  }
}
