import { calculateLegalMoveMap } from "../logic/position";
import { CreateGameRequest, GameInstanceState, GameResult, TimeBank } from "./api";
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
  timeBank: TimeBank;
  drawOffer: string;
}

export function getCleanCreateGameRequest(): CreateGameRequest {
  return {
    white_time_control: {
      time_left_ms: 60 * 1000 * 5,
      increment_ms: 0
    },
    black_time_control: {
      time_left_ms: 60 * 1000 * 5,
      increment_ms: 0
    },
    use_matchmaking_pool: false,
    player_requests_white: true,
    requestor_client_uuid: '',
  };
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
    timeBank: {white: 0, black: 0, server_time_now: 0},
    drawOffer: '',
  };
}
