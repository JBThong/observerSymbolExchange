import { Controller, Get, Render, Query } from '@nestjs/common';

import { SymbolService } from './symbol.service';


@Controller('symbols')
export class SymbolController {

    constructor(private readonly symbolService: SymbolService) {}

    @Get()
    @Render('ordersbook')
    async getOrderList(@Query() query: { symbol: string, limit: number }) {
        try {
            let data = await this.symbolService.getOrderList(query?.symbol, query?.limit);
            return {
                    statusCode: 200,
                    msg: null,
                    data: data
                };
        }
        catch (err) {
            return {
                    statusCode: 400,
                    msg: err
                }
        }
    }
}
