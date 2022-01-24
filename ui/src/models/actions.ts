export enum ActionType {
  UPDATE_POSITION = "UPDATE_POSITION",
  SELECT_SQUARE = "SELECT_SQUARE",
}

export declare interface Action {
  type: ActionType;
  payload: any;
}
