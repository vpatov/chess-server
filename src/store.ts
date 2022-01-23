import { createStore } from 'redux';

export declare interface State {
  selectedSquare: number | undefined;
}

function getCleanState(): State {
  return {selectedSquare: undefined};
}

const rootReducer = (state = getCleanState(), action: any): State => {
  return state;
}

export const store = createStore(rootReducer);

export default store;