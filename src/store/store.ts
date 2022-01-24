import { createStore } from "redux";
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
    case ActionType.UPDATE_POSITION: {
      return {
        ...state,
        positionInfo: fenToPosition(action.payload),
      };
    }
    default:
      return state;
  }
};

export const store = createStore(rootReducer);

export default store;
