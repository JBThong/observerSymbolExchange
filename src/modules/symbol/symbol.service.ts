import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { BINANCE_HOST } from '../../../configuration/constants/index';


@Injectable()
export class SymbolService {
    constructor(private httpService: HttpService) {};

    getLatestOrderbookProgress(symbol: String) {
        return this.httpService.get(`${BINANCE_HOST}ticker/bookTicker?symbol=${symbol}`).toPromise();
    }
}
