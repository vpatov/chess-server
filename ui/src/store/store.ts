import { createStore } from "redux";
import { get_legal_moves } from "../api/api";
import { algebraicSquareToIndex, fenToPosition } from "../logic/fen";
import { calculateLegalMoveMap } from "../logic/position";
import { Action, ActionType } from "../models/actions";
import { PositionInfo, getStartingPosition } from "../models/position";
import { getCleanState, State } from "../models/state";

const rootReducer = (state = getCleanState(), action: Action): State => {
  switch (action.type) {
    case ActionType.SELECT_SQUARE: {
      const payload = action.selectSquarePayload!;

      const result: Partial<State> = {};

        if (state.legalMoveMap.has(payload.selectedSquare)){
          result.selectedSquare = payload.selectedSquare;
          result.possibleDestinationSquares = state.legalMoveMap.get(payload.selectedSquare);
        }
      
      return {
        ...state,
        selectedSquare:
          (state.selectedSquare === payload.selectedSquare) ? undefined : payload.selectedSquare,
        possibleDestinationSquares:
          (state.selectedSquare === payload.selectedSquare) ? new Set<number>() : payload.possibleDestinationSquares,
      };
    }
    case ActionType.UPDATE_FEN: {
      return {
        ...state,
        positionInfo: fenToPosition(action.updateFenPayload!),
        legalMoves: [],
      };
    }
    case ActionType.SERVER_GAME_STATE_UPDATE: {
      const update = action.serverGameStateUpdatePayload!;
      const legalMoveMap = calculateLegalMoveMap(update.legal_moves);
      
      return {
        ...state,
        positionInfo: fenToPosition(update.fen),
        legalMoves: update.legal_moves,
        legalMoveMap: legalMoveMap
      }
    }
    default:
      return state;
  }
};

export const store = createStore(rootReducer);

export default store;
