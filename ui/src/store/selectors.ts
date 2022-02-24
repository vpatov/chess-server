import { GameInstanceState, GameResult, TimeBank } from "../models/api";
import { PositionInfo } from "../models/position";
import { State } from "../models/state";
import { GameInstanceUUID } from "../models/uuid";


export const possibleDestinationSquaresSelector = (state: State): Set<number> =>
  state.possibleDestinationSquares;
export const kingInCheckSquareSelector = (state: State): number | undefined => state.kingInCheckSquare;
export const squaresOfLastPlayedMoveSelector = (state: State): [number, number] => state.squaresOfLastPlayedMove;
export const movesPlayedSelector = (state: State): string[] =>
  state.movesPlayed;
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

export const timeBankSelector = (state: State): TimeBank => state.timeBank;

export const gameInstanceStateSelector = (state: State): GameInstanceState => state.gameInstanceState;

export const drawOfferSelector = (state: State): string => state.drawOffer;

export const gameInstancesSelector = (state: State): GameInstanceUUID[] =>
  state.gameInstances.filter((gameInstanceUUID) => gameInstanceUUID.length > 1);