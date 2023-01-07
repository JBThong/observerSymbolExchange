import { Test, TestingModule } from '@nestjs/testing';
import { SymbolController } from './symbol.controller';
import { SymbolService } from './symbol.service';

describe('SymbolController', () => {
  let controller: SymbolController;
  let spyService: SymbolService;

  beforeEach(async () => {
    const SymbolServiceProvider = {
      provide: SymbolService,
      useFactory: () => ({
        getOrderList: jest.fn(() => {
          return {
              symbol: 'ETHBTC',
              bidOrderList: [{price: 0.03, qty: 0.1}, {price: 0.031, qty: 0.1}],
              askOrderList: [{price: 0.04, qty: 0.1}, {price: 0.03, qty: 0.1}],
              sumSizeBidOrderList: 0.2,
              sumSizeAskOrderList: 0.2,
              sumTotalBidOrderList: 0.0061,
              sumTotalAskOrderList: 0.007,
          }
        }),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SymbolController],
      providers: [SymbolService, SymbolServiceProvider],
    }).compile();

    controller = module.get<SymbolController>(SymbolController);
    spyService = module.get<SymbolService>(SymbolService);
  });

  describe('getOrderList', () => {
    it('return data from getOrderList', async () => {
      const symbol = 'ETHBTC';
      const limit = 2;
      let expectData = {
          symbol: 'ETHBTC',
          bidOrderList: [{price: 0.03, qty: 0.1}, {price: 0.031, qty: 0.1}],
          askOrderList: [{price: 0.04, qty: 0.1}, {price: 0.03, qty: 0.1}],
          sumSizeBidOrderList: 0.2,
          sumSizeAskOrderList: 0.2,
          sumTotalBidOrderList: 0.0061,
          sumTotalAskOrderList: 0.007,
      };

      let data = await controller.getOrderList({symbol: symbol, limit: limit});
      expect(data.statusCode).toEqual(200);
      expect(data.data).toEqual(expectData);
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
