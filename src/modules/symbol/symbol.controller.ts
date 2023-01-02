import { Controller, Get, Render, Query } from '@nestjs/common';

import { SymbolService } from './symbol.service';


@Controller('symbols')
export class SymbolController {

    constructor(private readonly symbolService: SymbolService) {}

    @Get()
    @Render('ordersbook')
    getOrderList(@Query('symbol') symbol) {
        return this.symbolService.getLatestOrderbookProgress(symbol).then(data => {
            return {data: data};
        });
    }
}
