import { assert } from "console";
import { CHESS_SERVER_HOST, CLIENT_UUID_KEY, WS_SERVER_PORT } from "../models/constants";
import { ClientUUID, GameInstanceUUID } from "../models/uuid";
import queryString, { ParsedQuery } from 'query-string';
import { LANMove } from "../models/fen";

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
    static subscriptions: { [key: string]: Array<Function> } = {};
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

        if (this.ws?.OPEN){
            return true;
        }
        WsServer.ws = new WebSocket(queryString.stringifyUrl(wsURI), []);
        WsServer.ws.onmessage = WsServer.onGameMessage;
        // WsServer.ws.onclose = WsServer.onWSClose;
        return true;
    }

    private static onGameMessage(msg: MessageEvent) {
        const jsonData = JSON.parse(msg.data);
        console.log(jsonData);
        Object.keys(WsServer.subscriptions).forEach((key) => {
            // TODO this isn't generalized rn, its hardcoded
            WsServer.subscriptions['serverGameStateUpdate'].forEach((func) => func(jsonData));
            // if (jsonData[key]) {
            //     WsServer.subscriptions[key].forEach((func) => func(jsonData[key]));
            // }
        });
    }

    static subscribe(key: string, onMessage: Function) {
        if (WsServer.subscriptions[key]) {
            WsServer.subscriptions[key].push(onMessage);
        } else {
            WsServer.subscriptions[key] = [onMessage];
        }
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