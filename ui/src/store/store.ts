import { createStore } from "redux";
import { get_legal_moves } from "../api/api";
import { fenToPosition } from "../logic/fen";
import { Action, ActionType } from "../models/actions";
import { PositionInfo, getStartingPosition } from "../models/position";
import { getCleanState, State } from "../models/state";

const rootReducer = (state = getCleanState(), action: Action): State => {
  switch (action.type) {
    case ActionType.SELECT_SQUARE: {
      const selectedSquare =
        state.selectedSquare === action.payload ? undefined : action.payload;
      return {
        ...state,
        selectedSquare,
      };
    }
    case ActionType.UPDATE_FEN: {
      return {
        ...state,
        positionInfo: fenToPosition(action.payload),
        legalMoves: [],
      };
    }
    case ActionType.SERVER_GAME_STATE_UPDATE: {
      const update = action.serverGameStateUpdate!;
      return {
        ...state,
        positionInfo: fenToPosition(update.fen),
        legalMoves: update.legal_moves,
      }
    }
    case ActionType.FETCHED_LEGAL_MOVES: {
      return {
        ...state,
        legalMoves: action.payload,
      };
    }
    default:
      return state;
  }
};

export const store = createStore(rootReducer);

export default store;
