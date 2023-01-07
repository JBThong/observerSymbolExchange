import { Injectable } from "@nestjs/common";
import { WebSocket } from "ws";
import { WSS_BINANCE_ENDPOINT } from '../../configuration/constants/index';
import { parseStreamBookTicker } from '../helpers/index';
import { Observable } from "rxjs";
import { Logger } from "@nestjs/common";


@Injectable()
export class BinanceGateway {

    public socket: WebSocket;
    protected urlSocket = '';
    private readonly logger = new Logger(BinanceGateway.name)

    constructor(symbol: string, method: string) {
        this.urlSocket = `${WSS_BINANCE_ENDPOINT}/ws/${symbol.toLowerCase()}@${method}`;
    }

    /**
     * Returns an observable data, which we get from real time exchange.
     * 
     * @returns { Observable } The observable data.
     * 
     */
    broadcastBookTickerPrice() {
        this.socket = new WebSocket(this.urlSocket);
        let stream = new Observable((observer) => {
            this.socket.on('open', () => {
                this.logger.log('Connection established')
            })
            this.socket.onmessage = (msg: any) => {
                let data = parseStreamBookTicker(JSON.parse(msg.data))
                observer.next(data)
            }
            this.socket.on('close', () => {
                this.logger.log('Connection closed')
            })
        })

        return stream;
    }
}