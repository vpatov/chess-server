import { GameResult } from "../models/actions";
import { PositionInfo } from "../models/position";
import { State } from "../models/state";


export const possibleDestinationSquaresSelector = (state: State): Set<number> =>
  state.possibleDestinationSquares;
// export const promotionChoiceSelector = (state: State): number | undefined =>
//   state.promotionChoice;

export const gameResultSelector = (state: State): GameResult | undefined =>
  state.gameResult;
export const selectedSquareSelector = (state: State): number | undefined =>
  state.selectedSquare;
export const fenStringSelector = (state: State): string => state.positionInfo.fen_string;
export const positionSelector = (state: State): PositionInfo =>
  state.positionInfo;
  export const clientPlayingWhiteSelector = (state: State): boolean =>
  state.clientPlayingWhite;
export const legalMovesSelector = (state: State): Array<string> =>
  state.legalMoves;
export const clientUUIDSelector = (state: State): string => state.clientUUID;
export const currentTurnClientUUIDSelector = (state: State): string => state.currentTurnClientUUID;