import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { BINANCE_HOST } from '../../../configuration/constants/index';
import { lastValueFrom } from 'rxjs';


@Injectable()
export class SymbolService {
    constructor(private httpService: HttpService) {};

    async getLatestOrderbookProgress(symbol: String) {
        let bookTicker = await lastValueFrom(this.httpService.get(`${BINANCE_HOST}ticker/bookTicker?symbol=${symbol}`));
        return bookTicker.data;
    }
}
