import { ClientUUID } from "./uuid";

export enum ActionType {
  UPDATE_FEN = "UPDATE_POSITION",
  SELECT_SQUARE = "SELECT_SQUARE",
  SET_CLIENT_UUID = "SET_CLIENT_UUID",
  SERVER_GAME_STATE_UPDATE = "SERVER_GAME_STATE_UPDATE",
  SERVER_GAME_STATE_INIT = "SERVER_GAME_STATE_INIT",
  REDIRECT_TO_GAME_INSTANCE = "REDIRECT_TO_GAME_INSTANCE",
}

export declare interface Action {
  type: ActionType;
  serverGameStateUpdatePayload?: ServerGameStateUpdatePayload;
  serverGameInitPayload?: ServerGameInitPayload;
  selectSquarePayload?: SelectSquarePayload;
  updateFenPayload?: string;
  gameInstanceUUID?: string;
  clientUUID?: string;
}

export enum GameOverCondition {
  DRAW = 'DRAW',
  RESIGNATION = 'RESIGNATION',
  CHECKMATE = 'CHECKMATE',
  TIMEOUT = 'TIMEOUT'
}

export declare interface GameOverPayload {
  winnerUUID: ClientUUID;
  condition: GameOverCondition
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

export declare interface ServerGameStateUpdatePayload {
  fen: string;
  legal_moves: Array<string>;
  currentTurnClientUUID: string;
  result?: GameResult;

}

export const enum ServerWsMessageType {
  GAME_INIT = "GAME_INIT",
  GAME_STATE_UPDATE = "GAME_STATE_UPDATE"
};

export declare interface ServerWsMessage {
  messageType: ServerWsMessageType;
  payload: ServerGameInitPayload | ServerGameStateUpdatePayload;
}

export declare interface ServerGameInitPayload {
  client_playing_white: boolean;
  // time control info
}

export declare interface SelectSquarePayload {
  selectedSquare: number;
  // possibleDestinationSquares: Set<number>;
}
