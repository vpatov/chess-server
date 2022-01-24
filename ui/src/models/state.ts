import { getStartingPosition, PositionInfo } from "./position";

export declare interface State {
  selectedSquare: number | undefined;
  positionInfo: PositionInfo;
}

export function getCleanState(): State {
  return { selectedSquare: undefined, positionInfo: getStartingPosition() };
}
