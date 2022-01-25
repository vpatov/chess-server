import { resourceUsage } from "process";
import { LANMove as LanMove } from "./fen";
import { PieceType } from "./piece";

export declare interface PositionInfo {
  board: PieceType[][];
  en_passant_square: number;
  move_number: number;
  moves_since_pawn_move_or_capture: number;
  whites_turn: boolean;
  wk_castle: boolean;
  wq_castle: boolean;
  bk_castle: boolean;
  bq_castle: boolean;
}

export function getStartingPositionLegalMoves(): Array<LanMove> {
  return [
    "b1a3",
    "b1c3",
    "g1f3",
    "g1h3",
    "a2a3",
    "a2a4",
    "b2b3",
    "b2b4",
    "c2c3",
    "c2c4",
    "d2d3",
    "d2d4",
    "e2e3",
    "e2e4",
    "f2f3",
    "f2f4",
    "g2g3",
    "g2g4",
    "h2h3",
    "h2h4",
  ];
}

export function getStartingPosition(): PositionInfo {
  return {
    en_passant_square: 0,
    move_number: 1,
    moves_since_pawn_move_or_capture: 0,
    whites_turn: true,
    wk_castle: true,
    wq_castle: true,
    bk_castle: true,
    bq_castle: true,
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
}

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
