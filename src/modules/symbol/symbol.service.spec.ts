import { Test, TestingModule } from '@nestjs/testing';
import { SymbolService } from './symbol.service';

describe('SymbolService', () => {
  let service: SymbolService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SymbolService],
    }).compile();

    service = module.get<SymbolService>(SymbolService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
