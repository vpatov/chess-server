import { LANMove } from "./fen";
import {
  getStartingPosition,
  getStartingPositionLegalMoves,
  PositionInfo,
} from "./position";

export declare interface State {
  selectedSquare: number | undefined;
  positionInfo: PositionInfo;
  legal_moves: Array<LANMove>;
}

export function getCleanState(): State {
  return {
    selectedSquare: undefined,
    positionInfo: getStartingPosition(),
    legal_moves: getStartingPositionLegalMoves(),
  };
}
