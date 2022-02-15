import { ServerGameInitPayload, ServerGameStateUpdatePayload } from "./api";
import { ClientUUID } from "./uuid";

export enum ReduxActionType {
  SELECT_SQUARE = "SELECT_SQUARE",
  SET_CLIENT_UUID = "SET_CLIENT_UUID",
  SERVER_GAME_STATE_UPDATE = "SERVER_GAME_STATE_UPDATE",
  SERVER_GAME_STATE_INIT = "SERVER_GAME_STATE_INIT",
  REDIRECT_TO_GAME_INSTANCE = "REDIRECT_TO_GAME_INSTANCE",
}

export declare interface ReduxAction {
  type: ReduxActionType;
  serverGameStateUpdatePayload?: ServerGameStateUpdatePayload;
  serverGameInitPayload?: ServerGameInitPayload;
  selectSquarePayload?: SelectSquarePayload;
  gameInstanceUUID?: string;
  clientUUID?: ClientUUID;
}

export declare interface SelectSquarePayload {
  selectedSquare: number;
  deselect?: boolean;
}

