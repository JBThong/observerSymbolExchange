import { Controller, Get, Render, Query } from '@nestjs/common';

import { SymbolService } from './symbol.service';


@Controller('symbols')
export class SymbolController {

    constructor(private readonly symbolService: SymbolService) {}

    @Get()
    @Render('ordersbook')
    getOrderList(@Query() query: { symbol: string, limit: number }) {
        return this.symbolService.getOrderList(query?.symbol, query?.limit)
                                .then(data => {
                                    return {
                                        statusCode: 200,
                                        msg: null,
                                        data: data
                                    };
                                })
                                .catch(err => { 
                                    return {
                                        statusCode: 400,
                                        msg: err
                                    }
                                });
    }
}
