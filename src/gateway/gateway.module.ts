import { Module } from '@nestjs/common';
import { SymbolGateway } from './symbolgateway';
import { BinanceGateway } from './binancegateway';
import { SymbolModule } from '../modules/symbol/symbol.module';
import { SymbolService } from '../modules/symbol/symbol.service';

@Module({
    imports: [
        SymbolModule,
    ],
    providers: [ SymbolGateway],
})
export class GatewayModule {}
