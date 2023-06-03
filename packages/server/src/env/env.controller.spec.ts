import { Test, TestingModule } from '@nestjs/testing';
import { EnvController } from './env.controller';
import { EnvService } from './env.service';

describe('EnvController', () => {
  let controller: EnvController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnvController],
      providers: [EnvService],
    }).compile();

    controller = module.get<EnvController>(EnvController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
