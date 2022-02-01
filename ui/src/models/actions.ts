export enum ActionType {
  UPDATE_FEN = "UPDATE_POSITION",
  SELECT_SQUARE = "SELECT_SQUARE",
  SET_CLIENT_UUID = "SET_CLIENT_UUID",
  SERVER_GAME_STATE_UPDATE = "SERVER_GAME_STATE_UPDATE"
}

export declare interface Action {
  type: ActionType;
  serverGameStateUpdatePayload?: ServerGameStateUpdatePayload;
  selectSquarePayload?: SelectSquarePayload;
  updateFenPayload?: string;
}

export declare interface ServerGameStateUpdatePayload {
  fen: string;
  legal_moves: Array<string>;
}

export declare interface SelectSquarePayload {
  selectedSquare: number;
  // possibleDestinationSquares: Set<number>;
}
