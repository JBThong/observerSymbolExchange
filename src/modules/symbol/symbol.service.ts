import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { BINANCE_HOST } from '../../../configuration/constants/index';
import { lastValueFrom } from 'rxjs';

import { generateOrderList } from '../../helpers/index'

@Injectable()
export class SymbolService {
    constructor(private httpService: HttpService) {};

    getLatestOrderbookProgress(symbol: String) {
        return lastValueFrom(this.httpService.get(`${BINANCE_HOST}ticker/bookTicker?symbol=${symbol}`));
    }

    async getOrderList(symbol, limit = 10) {
        let bookTicker = await this.getLatestOrderbookProgress(symbol).then(data => { return data.data })
        
        let bidOrderList = generateOrderList(1, bookTicker, limit);
        let askOrderList = generateOrderList(2, bookTicker, limit);

        return {
            symbol: symbol,
            bidOrderList: bidOrderList,
            askOrderList: askOrderList,
        }
    
    }
}
