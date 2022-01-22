import { useState } from "react";
import Piece, { PieceType, PIECE_TYPE_CLASSES } from "./piece";

// TODO try to incorporate this fixed length business.
// taken from https://stackoverflow.com/questions/41139763/how-to-declare-a-fixed-length-array-in-typescript
type ArrayLengthMutationKeys = "splice" | "push" | "pop" | "shift" | "unshift";
type FixedLengthArray<T, L extends number, TObj = [T, ...Array<T>]> = Pick<
  TObj,
  Exclude<keyof TObj, ArrayLengthMutationKeys>
> & {
  readonly length: L;
  [I: number]: T;
  [Symbol.iterator]: () => IterableIterator<T>;
};

interface PositionInfo {
  board: PieceType[][];
}

// indexed from the top, i.e.
// board[0][0] = a8
// board[0][1] = b8
// ... board[7][7] = h1
const STARTING_POSITION: PositionInfo = {
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

function Position() {
  const [position, setPosition] = useState(STARTING_POSITION);
  const pieceComponents = [];

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      pieceComponents.push(
        <Piece
          pieceType={PIECE_TYPE_CLASSES[position.board[i][j]]}
          i={i}
          j={j}
        ></Piece>
      );
    }
  }
  return <>{pieceComponents}</>;
}

export default Position;
