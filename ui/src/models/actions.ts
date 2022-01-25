export enum ActionType {
  UPDATE_POSITION = "UPDATE_POSITION",
  SELECT_SQUARE = "SELECT_SQUARE",
  FETCHED_LEGAL_MOVES = "FETCHED_LEGAL_MOVES",
}

export declare interface Action {
  type: ActionType;
  payload: any;
}
