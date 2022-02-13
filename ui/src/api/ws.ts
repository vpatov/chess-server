import { assert } from "console";
import { CHESS_SERVER_HOST, CLIENT_UUID_KEY, WS_SERVER_PORT } from "../models/constants";
import { ClientUUID, GameInstanceUUID } from "../models/uuid";
import queryString, { ParsedQuery } from 'query-string';
import { LANMove } from "../models/fen";
import { ServerWsMessageType } from "../models/actions";

export const enum ActionType {
    START_GAME = 0, 
    MAKE_MOVE = 1,
    RESIGN = 2,
    OFFER_DRAW = 3,
    ACCEPT_DRAW_OFFER = 4,
    TAKE_BACK_DRAW_OFFER = 5,
    DECLINE_DRAW_OFFER = 6
}

export declare interface WsAction {
    type: ActionType;
    payload: string;
}


export class WsServer {
    static clientUUID: ClientUUID | null = null;
    static ws: WebSocket;
    static subscriptions: { [key: string]: Function } = {};
    static timeLastSentMsg: number;

    static openWs(gameInstanceUUID: GameInstanceUUID) {
        const clientUUID = window.localStorage.getItem(CLIENT_UUID_KEY);
        if (!clientUUID){
            throw Error("clientUUID is not initialized, cannot open websocket.");
        }
        const wsURL = `ws://${CHESS_SERVER_HOST}:${WS_SERVER_PORT}`;
        const wsURI = {
            url: wsURL,
            query: { clientUUID, gameInstanceUUID }
        };

        // if (this.ws?.OPEN){
        //     return true;
        // }
        // TODO write some sort of logic that tries to assert that the incoming game state updates
        // are only ever for the current game instance, to help with debugging.
        WsServer.ws = new WebSocket(queryString.stringifyUrl(wsURI), []);
        WsServer.ws.onmessage = WsServer.onServerMessage;
        // WsServer.ws.onclose = WsServer.onWSClose;
        return true;
    }

    private static onServerMessage(msg: MessageEvent) {
        const message = JSON.parse(msg.data);
        const messageType = message["messageType"];

        console.log(message);

        const subscriptionFn = WsServer.subscriptions[messageType];
        if (!subscriptionFn){
            throw Error(`Received unknown messageType: ${messageType}`);
        }
        subscriptionFn(message["payload"]);
    }

    static subscribe(key: ServerWsMessageType, onMessage: Function) {
            WsServer.subscriptions[key] = onMessage;
    }

    static sendMessage(wsAction: WsAction){
        this.ws.send(JSON.stringify(wsAction));
    }

    static makeMove(lanMove: LANMove){
        this.sendMessage({
            type: ActionType.MAKE_MOVE,
            payload: lanMove
        });
    }

    // static makeMove(gameInstanceUUID: string, lanMove: LANMove){
    //     if (!(gameInstanceUUID.length > 1 && lanMove.length > 1)){
    //         console.assert(false);
    //         console.log("gameInstanceUUID is empty");
    //         return;
    //     }
    //     this.ws.send(JSON.stringify({gameInstanceUUID, lanMove}));
    // }
}