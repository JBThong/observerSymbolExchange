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

@WebSocketGateway()
export class SymbolGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer()
    server: Server

    constructor(private readonly symbolService: SymbolService) {}

    @SubscribeMessage('sendSymbol')
    async handleSendMessage(client: Socket, symbol) {
        let orderList = await this.symbolService.getOrderList(symbol);
        this.server.emit('recOrderList', orderList);
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