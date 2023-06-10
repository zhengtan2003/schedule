import { Test, TestingModule } from '@nestjs/testing';
import { TaskLogService } from './task-log.service';

describe('TaskLogService', () => {
  let service: TaskLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskLogService],
    }).compile();

    service = module.get<TaskLogService>(TaskLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
