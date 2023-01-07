import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { BINANCE_HOST } from '../../../configuration/constants/index';
import { lastValueFrom } from 'rxjs';

import { generateOrderList, calculateSum } from '../../helpers/index'

@Injectable()
export class SymbolService {
    constructor(private httpService: HttpService) {};
    
    /**
     * Get latest booktTicker base on requesting to exchange.
     * 
     * @param {String} symbol The symbol which we request.
     * @returns {Object} The bookTicker object.
     * 
     */
    getLatestOrderbookProgress(symbol: String) {
        return lastValueFrom(this.httpService.get(`${BINANCE_HOST}ticker/bookTicker?symbol=${symbol}`));
    }

    /**
     * Returns Order list.
     * 
     * @param {String} symbol The symbol.
     * @param {number} limit
     * @returns {Object} The order list data.
     * 
     */
    async getOrderList(symbol: string, limit = 10) {
        let bookTicker = await this.getLatestOrderbookProgress(symbol)
                                    .then(data => { return data.data })
                                    .catch(err => { 
                                        console.log(err.response.data)
                                        return err.response.data});

        if (bookTicker?.code) {
            throw new Error(bookTicker.msg);
        }
    
        return this.generateOrderList(bookTicker, limit)
    }

    /**
     * Returns generate order list base on lastest booktiker.
     * 
     * @param {Object} bookTicker The symbol.
     * @param {number} limit
     * @returns {Object} The order list data.
     * 
     */
    generateOrderList(bookTicker, limit = 10) {
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
