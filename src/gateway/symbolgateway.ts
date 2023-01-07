import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SymbolService } from '../modules/symbol/symbol.service'
import { BinanceGateway } from './binancegateway';
import { Logger } from "@nestjs/common";
import { map, tap } from 'rxjs';


@WebSocketGateway()
export class SymbolGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer()
    server: Server

    private readonly logger = new Logger(SymbolGateway.name)

    constructor(
        private readonly symbolService: SymbolService,
    ) {}

    @SubscribeMessage('sendSymbol')
    async handleSendOrderList(client: Socket, symbol: string) {
        let binanceGateway = new BinanceGateway(symbol, 'bookTicker');
        return binanceGateway.broadcastBookTickerPrice().pipe(map((bookTicker) => {
            let orderList = this.symbolService.broadcastOrderList(bookTicker);
            this.server.emit('recOrderList', orderList);
          }))
    }

    async handleConnection(client: Socket) {
        console.log("Connected client id: ", client.id);

    }

    async handleDisconnect(client: Socket) {
        console.log("disconnected client id: ", client.id);
    }

    afterInit(server: any): any {
        console.log("afterInit");
    }
}