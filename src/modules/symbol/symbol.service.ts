import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { BINANCE_HOST } from '../../../configuration/constants/index';
import { lastValueFrom } from 'rxjs';

import { generateOrderList, calculateSum } from '../../helpers/index'

@Injectable()
export class SymbolService {
    constructor(private httpService: HttpService) {};

    getLatestOrderbookProgress(symbol: String) {
        return lastValueFrom(this.httpService.get(`${BINANCE_HOST}ticker/bookTicker?symbol=${symbol}`));
    }

    async getOrderList(symbol: string, limit = 10) {
        let bookTicker = await this.getLatestOrderbookProgress(symbol)
                                    .then(data => { return data.data })
                                    .catch(err => { 
                                        console.log(err.response.data)
                                        return err.response.data});

        if (bookTicker?.code) {
            throw new Error(bookTicker.msg);
        }
    
        return this.broadcastOrderList(bookTicker, limit)
    }

    broadcastOrderList(bookTicker, limit = 10) {
        let bidOrderList = generateOrderList(1, bookTicker, limit);
        let askOrderList = generateOrderList(2, bookTicker, limit);
        let sumSizeBidOrderList = calculateSum(bidOrderList, 'qty').toFixed(6);
        let sumSizeAskOrderList = calculateSum(askOrderList, 'qty').toFixed(6);
        let sumTotalBidOrderList = calculateSum(bidOrderList, 'total').toFixed(6);
        let sumTotalAskOrderList = calculateSum(askOrderList, 'total').toFixed(6);

        return {
            symbol: bookTicker.symbol,
            bidOrderList: bidOrderList,
            askOrderList: askOrderList,
            sumSizeBidOrderList: sumSizeBidOrderList,
            sumSizeAskOrderList: sumSizeAskOrderList,
            sumTotalBidOrderList: sumTotalBidOrderList,
            sumTotalAskOrderList: sumTotalAskOrderList,
        }
    }
}
