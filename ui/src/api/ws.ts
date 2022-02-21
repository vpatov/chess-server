import { CHESS_SERVER_HOST, CLIENT_UUID_KEY, WS_SERVER_PORT } from "../models/constants";
import { ClientUUID, GameInstanceUUID } from "../models/uuid";
import queryString, { ParsedQuery } from 'query-string';
import { LANMove } from "../models/fen";
import { ClientWsAction, ClientWsActionType, ServerWsMessageType } from "../models/api";



export class WsServer {
    static clientUUID: ClientUUID | null = null;
    static ws: WebSocket;
    static subscriptions: { [key: string]: Function } = {};
    static timeLastSentMsg: number;

    static openWs(gameInstanceUUID: GameInstanceUUID, onErrorCallback: any) {
        const clientUUID = window.localStorage.getItem(CLIENT_UUID_KEY);
        if (!clientUUID) {
            throw Error("clientUUID is not initialized, cannot open websocket.");
        }
        const wsURL = `ws://${CHESS_SERVER_HOST}:${WS_SERVER_PORT}`;
        const wsURI = {
            url: wsURL,
            query: { clientUUID, gameInstanceUUID }
        };

        if (this.ws?.OPEN){
            this.ws.close();
        }
        // TODO write some sort of logic that tries to assert that the incoming game state updates
        // are only ever for the current game instance, to help with debugging.
        WsServer.ws = new WebSocket(queryString.stringifyUrl(wsURI), []);
        WsServer.ws.onerror = onErrorCallback;
        WsServer.ws.onmessage = WsServer.onServerMessage;
    }

    private static onServerMessage(msg: MessageEvent) {
        const message = JSON.parse(msg.data);
        const messageType = message["messageType"];

        console.log(message);

        const subscriptionFn = WsServer.subscriptions[messageType];
        if (!subscriptionFn) {
            throw Error(`Received unknown messageType: ${messageType}`);
        }
        subscriptionFn(message["payload"]);
    }

    static subscribe(key: ServerWsMessageType, onMessage: Function) {
        WsServer.subscriptions[key] = onMessage;
    }

    static sendMessage(wsAction: ClientWsAction) {
        this.ws.send(JSON.stringify(wsAction));
    }

    static makeMove(lanMove: LANMove) {
        this.sendMessage({
            type: ClientWsActionType.MAKE_MOVE,
            payload: lanMove
        });
    }

    static startGame(){
        this.sendMessage({
            type: ClientWsActionType.START_GAME,
            payload: '',
        });
    }

    static resign(){
        this.sendMessage({
            type: ClientWsActionType.RESIGN,
            payload: '',
        });
    }

    static rescindDrawOffer(){
        this.sendMessage({
            type: ClientWsActionType.TAKE_BACK_DRAW_OFFER,
            payload: '',
        });
    }

    static acceptDrawOffer(){
        this.sendMessage({
            type: ClientWsActionType.ACCEPT_DRAW_OFFER,
            payload: '',
        });
    }

    static offerDraw(){
        this.sendMessage({
            type: ClientWsActionType.OFFER_DRAW,
            payload: '',
        });
    }

    static declineDrawOffer(){
        this.sendMessage({
            type: ClientWsActionType.DECLINE_DRAW_OFFER,
            payload: '',
        });
    }
}