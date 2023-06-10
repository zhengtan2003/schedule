import { Test, TestingModule } from '@nestjs/testing';
import { TaskEnvService } from './task-env.service';

describe('TaskEnvService', () => {
  let service: TaskEnvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskEnvService],
    }).compile();

    service = module.get<TaskEnvService>(TaskEnvService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
