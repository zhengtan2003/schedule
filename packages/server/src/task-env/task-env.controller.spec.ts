import { Test, TestingModule } from '@nestjs/testing';
import { TaskEnvController } from './task-env.controller';
import { TaskEnvService } from './task-env.service';

describe('TaskEnvController', () => {
  let controller: TaskEnvController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskEnvController],
      providers: [TaskEnvService],
    }).compile();

    controller = module.get<TaskEnvController>(TaskEnvController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
