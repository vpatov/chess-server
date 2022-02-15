import { FenString } from "./fen";
import { ClientUUID } from "./uuid";

export const enum ClientWsActionType {
    START_GAME = 0,
    MAKE_MOVE = 1,
    RESIGN = 2,
    OFFER_DRAW = 3,
    ACCEPT_DRAW_OFFER = 4,
    TAKE_BACK_DRAW_OFFER = 5,
    DECLINE_DRAW_OFFER = 6
}

export declare interface ClientWsAction {
    type: ClientWsActionType;
    payload: string;
}


export const enum ServerWsMessageType {
    GAME_INIT = "GAME_INIT",
    GAME_STATE_UPDATE = "GAME_STATE_UPDATE"
};

export declare interface ServerWsMessage {
    messageType: ServerWsMessageType;
    payload: ServerGameInitPayload | ServerGameStateUpdatePayload;
}

export declare interface ServerGameStateUpdatePayload {
    fen: FenString;
    legal_moves: Array<string>;
    currentTurnClientUUID: ClientUUID;
    result?: GameResult;
    moves_played: string[];
    king_in_check_square?: string;
}

export declare interface ServerGameInitPayload {
    client_playing_white: boolean;
    // time control info
}

export const enum GameResultCondition {
    TIMEOUT = "TIMEOUT",
    CHECKMATE = "CHECKMATE",
    RESIGNATION = "RESIGNATION",
    DRAW = "DRAW",
    STALEMATE = "STALEMATE"
};

export declare interface GameResult {
    condition: GameResultCondition;
    winner?: ClientUUID;
}