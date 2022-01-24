import { PieceType } from "./piece";

export declare type FenString = string;

export const PIECE_TO_CHARACTER: { [key in PieceType]: string } = {
  WHITE_ROOK: "R",
  WHITE_KNIGHT: "N",
  WHITE_BISHOP: "B",
  WHITE_KING: "K",
  WHITE_PAWN: "P",
  WHITE_QUEEN: "Q",
  BLACK_ROOK: "r",
  BLACK_KNIGHT: "n",
  BLACK_BISHOP: "b",
  BLACK_KING: "k",
  BLACK_PAWN: "p",
  BLACK_QUEEN: "q",
  EMPTY_SQUARE: "",
};

export const CHARACTER_TO_PIECE: { [key: string]: PieceType } = {
  R: PieceType.WHITE_ROOK,
  N: PieceType.WHITE_KNIGHT,
  B: PieceType.WHITE_BISHOP,
  K: PieceType.WHITE_KING,
  P: PieceType.WHITE_PAWN,
  Q: PieceType.WHITE_QUEEN,
  r: PieceType.BLACK_ROOK,
  n: PieceType.BLACK_KNIGHT,
  b: PieceType.BLACK_BISHOP,
  k: PieceType.BLACK_KING,
  p: PieceType.BLACK_PAWN,
  q: PieceType.BLACK_QUEEN,
};
