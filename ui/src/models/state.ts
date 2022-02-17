import { TimeControl } from "../api/api";
import { calculateLegalMoveMap } from "../logic/position";
import { GameInstanceState, GameResult, PlayerTimeControl } from "./api";
import { LANMove } from "./fen";
import {
  getStartingPosition,
  getStartingPositionLegalMoves,
  PositionInfo,
} from "./position";

export declare type MoveMap = Map<number, Map<number,string[]>>;

export declare interface State {
  selectedSquare: number | undefined;
  possibleDestinationSquares: Set<number>;
  positionInfo: PositionInfo;
  legalMoves: Array<LANMove>;
  legalMoveMap: MoveMap;
  clientUUID: string;
  gameInstanceUUID: string;
  currentTurnClientUUID: string;
  clientPlayingWhite: boolean;
  gameResult: GameResult | undefined;
  movesPlayed: string[];
  squaresOfLastPlayedMove: [number, number];
  kingInCheckSquare: number | undefined;
  gameInstanceState: GameInstanceState;
  timeControl: PlayerTimeControl;
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
    gameInstanceUUID: '',
    currentTurnClientUUID: '',
    clientPlayingWhite: true,
    gameResult: undefined,
    movesPlayed: [],
    squaresOfLastPlayedMove: [-1,-1],
    kingInCheckSquare: undefined,
    gameInstanceState: GameInstanceState.NOT_STARTED,
    timeControl: {white: 0, black: 0}
  };
}
