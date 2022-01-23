import { createStore } from "redux";
import { Action, ActionType } from "../models/actions";
import { PositionInfo, STARTING_POSITION } from "../models/position";
import { State } from "../models/state";

function getCleanState(): State {
  return { selectedSquare: undefined, positionInfo: STARTING_POSITION };
}

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
        positionInfo: action.payload,
      };
    }
    default:
      return state;
  }
};

export const store = createStore(rootReducer);

export default store;
