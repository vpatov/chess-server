export enum ActionType {
  UPDATE_FEN = "UPDATE_POSITION",
  SELECT_SQUARE = "SELECT_SQUARE",
  SET_CLIENT_UUID = "SET_CLIENT_UUID",
  SERVER_GAME_STATE_UPDATE = "SERVER_GAME_STATE_UPDATE",
  REDIRECT_TO_GAME_INSTANCE = "REDIRECT_TO_GAME_INSTANCE",
}

export declare interface Action {
  type: ActionType;
  serverGameStateUpdatePayload?: ServerGameStateUpdatePayload;
  selectSquarePayload?: SelectSquarePayload;
  updateFenPayload?: string;
  gameInstanceUUID?: string;
  clientUUID?: string;
}

export enum GameOverCondition {
  DRAW = 'DRAW',
  RESIGNATION = 'RESIGNATION',
  CHECKMATE = 'CHECKMATE',
  ABANDONMENT = 'ABANDONMENT'
}

export declare interface GameOverPayload {
  winnerUUID: string;
  condition: GameOverCondition
}

export declare interface ServerGameStateUpdatePayload {
  fen: string;
  legal_moves: Array<string>;
  currentTurnClientUUID: string;

}

export declare interface SelectSquarePayload {
  selectedSquare: number;
  // possibleDestinationSquares: Set<number>;
}
