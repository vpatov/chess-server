import { State } from "./store";

export const selectedSquareSelector = (state: State): number|undefined => state.selectedSquare;
