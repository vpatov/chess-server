import { LANMove } from "./fen";
import {
  getStartingPosition,
  getStartingPositionLegalMoves,
  PositionInfo,
} from "./position";

export declare interface State {
  selectedSquare: number | undefined;
  positionInfo: PositionInfo;
  legalMoves: Array<LANMove>;
  clientUUID: string;
}

export function getCleanState(): State {
  return {
    selectedSquare: undefined,
    positionInfo: getStartingPosition(),
    legalMoves: getStartingPositionLegalMoves(),
    clientUUID: '',
  };
}
