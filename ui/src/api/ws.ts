import { assert } from "console";
import { CHESS_SERVER_HOST, CLIENT_UUID_KEY, WS_SERVER_PORT } from "../models/constants";
import { ClientUUID, GameInstanceUUID } from "../models/uuid";
import queryString, { ParsedQuery } from 'query-string';






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
}