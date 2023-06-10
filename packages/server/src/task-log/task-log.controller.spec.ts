import { Test, TestingModule } from '@nestjs/testing';
import { TaskLogController } from './task-log.controller';
import { TaskLogService } from './task-log.service';

describe('TaskLogController', () => {
  let controller: TaskLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskLogController],
      providers: [TaskLogService],
    }).compile();

    controller = module.get<TaskLogController>(TaskLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
