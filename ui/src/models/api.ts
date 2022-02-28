import { FenString } from "./fen";
import { ClientUUID } from "./uuid";

export declare interface CreateGameRequest {
    white_time_control: TimeControlParams;
    black_time_control: TimeControlParams;
    use_matchmaking_pool: boolean;
    player_requests_white: boolean;
    requestor_client_uuid: string;
}

export declare interface TimeControlParams {
    time_left_ms: number;
    increment_ms: number;
}

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
    GAME_STATE_UPDATE = "GAME_STATE_UPDATE",
    GAME_NOT_FOUND = "GAME_NOT_FOUND"
};

export declare interface ServerWsMessage {
    messageType: ServerWsMessageType;
    payload: ServerGameInitPayload | ServerGameStateUpdatePayload;
}

export declare interface TimeBank {
    white: number;
    black: number;
    server_time_now: number;
}

export declare interface ServerGameStateUpdatePayload {
    fen: FenString;
    legal_moves: Array<string>;
    currentTurnClientUUID: ClientUUID;
    result?: GameResult;
    moves_played: string[];
    king_in_check_square?: string;
    time_control: TimeBank;
    game_instance_state: GameInstanceState
    draw_offer: string;
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
    STALEMATE = "STALEMATE",
    INSUFFICIENT_MATERIAL = "INSUFFICIENT_MATERIAL",
    THREEFOLD_REPETITION = "THREEFOLD_REPETITION",

};

export declare interface GameResult {
    condition: GameResultCondition;
    winner?: string;
}

export const enum GameInstanceState {
    NOT_STARTED,
    READY_TO_START,
    IN_PLAY,
    FINISHED
}