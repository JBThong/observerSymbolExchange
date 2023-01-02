import { Test, TestingModule } from '@nestjs/testing';
import { SymbolController } from './symbol.controller';

describe('SymbolController', () => {
  let controller: SymbolController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SymbolController],
    }).compile();

    controller = module.get<SymbolController>(SymbolController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
