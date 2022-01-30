export enum ActionType {
  UPDATE_FEN = "UPDATE_POSITION",
  SELECT_SQUARE = "SELECT_SQUARE",
  FETCHED_LEGAL_MOVES = "FETCHED_LEGAL_MOVES",
  SET_CLIENT_UUID = "SET_CLIENT_UUID",
  SERVER_GAME_STATE_UPDATE = "SERVER_GAME_STATE_UPDATE"
}

export declare interface Action {
  type: ActionType;
  payload: any;
  serverGameStateUpdate?: ServerGameStateUpdate;
}

export declare interface ServerGameStateUpdate {
  fen: string;
  legal_moves: Array<string>;
}
