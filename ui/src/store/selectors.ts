import { PositionInfo } from "../models/position";
import { State } from "../models/state";

export const selectedSquareSelector = (state: State): number | undefined =>
  state.selectedSquare;
export const positionSelector = (state: State): PositionInfo =>
  state.positionInfo;

export const clientUUIDSelector = (state: State): string => state.clientUUID;