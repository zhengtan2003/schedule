import { Test, TestingModule } from '@nestjs/testing';
import { TerminalGateway } from './terminal.gateway';
import { TerminalService } from './terminal.service';

describe('TerminalGateway', () => {
  let gateway: TerminalGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TerminalGateway, TerminalService],
    }).compile();

    gateway = module.get<TerminalGateway>(TerminalGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
