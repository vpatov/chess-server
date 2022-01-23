import { PieceType } from "./piece";

export declare interface PositionInfo {
  board: PieceType[][];
}

export const STARTING_POSITION: PositionInfo = {
  board: [
    [
      PieceType.BLACK_ROOK,
      PieceType.BLACK_KNIGHT,
      PieceType.BLACK_BISHOP,
      PieceType.BLACK_QUEEN,
      PieceType.BLACK_KING,
      PieceType.BLACK_BISHOP,
      PieceType.BLACK_KNIGHT,
      PieceType.BLACK_ROOK,
    ],
    Array.from(Array(8).keys()).map((_) => PieceType.BLACK_PAWN),
    Array.from(Array(8).keys()).map((_) => PieceType.EMPTY_SQUARE),
    Array.from(Array(8).keys()).map((_) => PieceType.EMPTY_SQUARE),
    Array.from(Array(8).keys()).map((_) => PieceType.EMPTY_SQUARE),
    Array.from(Array(8).keys()).map((_) => PieceType.EMPTY_SQUARE),
    Array.from(Array(8).keys()).map((_) => PieceType.WHITE_PAWN),
    [
      PieceType.WHITE_ROOK,
      PieceType.WHITE_KNIGHT,
      PieceType.WHITE_BISHOP,
      PieceType.WHITE_QUEEN,
      PieceType.WHITE_KING,
      PieceType.WHITE_BISHOP,
      PieceType.WHITE_KNIGHT,
      PieceType.WHITE_ROOK,
    ],
  ],
};

// TODO try to incorporate this fixed length business.
// taken from https://stackoverflow.com/questions/41139763/how-to-declare-a-fixed-length-array-in-typescript
// type ArrayLengthMutationKeys = "splice" | "push" | "pop" | "shift" | "unshift";
// type FixedLengthArray<T, L extends number, TObj = [T, ...Array<T>]> = Pick<
//   TObj,
//   Exclude<keyof TObj, ArrayLengthMutationKeys>
// > & {
//   readonly length: L;
//   [I: number]: T;
//   [Symbol.iterator]: () => IterableIterator<T>;
// };
