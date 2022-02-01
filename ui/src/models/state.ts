import { calculateLegalMoveMap } from "../logic/position";
import { LANMove } from "./fen";
import {
  getStartingPosition,
  getStartingPositionLegalMoves,
  PositionInfo,
} from "./position";

export declare interface State {
  selectedSquare: number | undefined;
  possibleDestinationSquares: Set<number>;
  positionInfo: PositionInfo;
  legalMoves: Array<LANMove>;
  legalMoveMap: Map<number, Set<number>>;
  clientUUID: string;
}

export function getCleanState(): State {
  const legalMoves = getStartingPositionLegalMoves();
  return {
    selectedSquare: undefined,
    possibleDestinationSquares: new Set<number>(),
    positionInfo: getStartingPosition(),
    legalMoves: legalMoves,
    legalMoveMap: calculateLegalMoveMap(legalMoves),
    clientUUID: '',
  };
}
