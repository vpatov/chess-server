import { CreateGameRequest, ServerGameStateUpdatePayload } from "./api";
import { ClientUUID, GameInstanceUUID } from "./uuid";

export enum ReduxActionType {
  SELECT_SQUARE = "SELECT_SQUARE",
  SET_CLIENT_UUID = "SET_CLIENT_UUID",
  SERVER_GAME_STATE_UPDATE = "SERVER_GAME_STATE_UPDATE",
  SERVER_GAME_STATE_INIT = "SERVER_GAME_STATE_INIT",
  REDIRECT_TO_GAME_INSTANCE = "REDIRECT_TO_GAME_INSTANCE",
  TIMER_TICK = 'TIMER_TICK',
  DRAW_BUTTON_PRESS = 'DRAW_BUTTON_PRESS',
  DECLINE_DRAW_OFFER = 'DECLINE_DRAW_OFFER',
  RESIGN_BUTTON_PRESS = 'RESIGN_BUTTON_PRESS',
  GO_HOME = 'GO_HOME',
  CREATE_GAME_FORM_SUBMIT = 'CREATE_GAME_FORM_SUBMIT',
  GET_GAME_INSTANCES = 'GET_GAME_INSTANCES',
  SERVER_GAME_NOT_FOUND = 'SERVER_GAME_NOT_FOUND'
}

export declare interface ReduxAction {
  type: ReduxActionType;
  serverGameStateUpdatePayload?: ServerGameStateUpdatePayload;
  selectSquarePayload?: SelectSquarePayload;
  gameInstanceUUID?: string;
  clientUUID?: ClientUUID;
  createGameRequest?: CreateGameRequest;
  gameInstances?: GameInstanceUUID[];
}

export declare interface SelectSquarePayload {
  selectedSquare: number;
  deselect?: boolean;
}

