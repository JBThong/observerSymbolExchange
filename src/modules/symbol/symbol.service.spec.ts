import { Test, TestingModule } from '@nestjs/testing';
import { SymbolService } from './symbol.service';

describe('SymbolService', () => {
  let service: SymbolService;

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SymbolService, SymbolServiceProvider],
    }).compile();

    service = module.get<SymbolService>(SymbolService);
  });

  describe('getOrderList', () => {
    it('should call getOrderList', async () => {
      const symbol = 'ETHBTC';
      const limit = 2;
      service.getOrderList(symbol, limit);
      expect(service.getOrderList).toBeCalled();
    });

    it('return valid order list', () => {
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
      }

      let result = service.getOrderList(symbol, limit);
      expect(expectData).toEqual(result);
    });
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
