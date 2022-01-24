import { PieceType } from "../models/piece";
import { getStartingPosition } from "../models/position";
import {
  algebraicSquareToIndex,
  fenToPosition,
  indexToAlgebraicSquare,
  positionToFen,
} from "./fen";

test("correct fen string returned for starting position", () => {
  const position = getStartingPosition();
  const fen = positionToFen(position);
  const expectedFen =
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  expect(fen).toBe(expectedFen);
  expect(fenToPosition(fen)).toEqual(position);
});

test("correct fen string returned for custom position 1", () => {
  const position = getStartingPosition();
  position.board[0][4] = PieceType.EMPTY_SQUARE;
  position.board[0][5] = PieceType.BLACK_ROOK;
  position.board[0][6] = PieceType.BLACK_KING;
  position.board[0][7] = PieceType.EMPTY_SQUARE;

  position.board[1][1] = PieceType.EMPTY_SQUARE;
  position.board[1][3] = PieceType.EMPTY_SQUARE;
  position.board[1][4] = PieceType.EMPTY_SQUARE;

  position.board[2][1] = PieceType.BLACK_PAWN;
  position.board[2][4] = PieceType.BLACK_PAWN;
  position.board[2][5] = PieceType.BLACK_KNIGHT;

  position.board[3][3] = PieceType.BLACK_PAWN;

  position.board[4][1] = PieceType.BLACK_BISHOP;
  position.board[4][2] = PieceType.WHITE_PAWN;
  position.board[4][3] = PieceType.WHITE_PAWN;

  position.board[5][2] = PieceType.WHITE_KNIGHT;
  position.board[5][3] = PieceType.WHITE_BISHOP;
  position.board[5][4] = PieceType.WHITE_PAWN;
  position.board[5][5] = PieceType.WHITE_KNIGHT;

  position.board[6][2] = PieceType.EMPTY_SQUARE;
  position.board[6][3] = PieceType.EMPTY_SQUARE;
  position.board[6][4] = PieceType.EMPTY_SQUARE;

  position.board[7][1] = PieceType.EMPTY_SQUARE;
  position.board[7][5] = PieceType.EMPTY_SQUARE;
  position.board[7][6] = PieceType.WHITE_ROOK;
  position.board[7][7] = PieceType.EMPTY_SQUARE;

  position.whites_turn = false;
  position.en_passant_square = 0;
  position.wk_castle = false;
  position.wq_castle = true;
  position.bk_castle = false;
  position.bq_castle = false;

  position.moves_since_pawn_move_or_capture = 1;
  position.move_number = 7;

  const fen = positionToFen(position);

  const expectedFen =
    "rnbq1rk1/p1p2ppp/1p2pn2/3p4/1bPP4/2NBPN2/PP3PPP/R1BQK1R1 b Q - 1 7";
  expect(fen).toBe(expectedFen);
  expect(fenToPosition(fen)).toEqual(position);
});

test("correct fen string returned for custom position 2", () => {
  const position = getStartingPosition();
  position.board[0][4] = PieceType.EMPTY_SQUARE;
  position.board[0][5] = PieceType.BLACK_ROOK;
  position.board[0][6] = PieceType.BLACK_KING;
  position.board[0][7] = PieceType.EMPTY_SQUARE;

  position.board[1][1] = PieceType.EMPTY_SQUARE;
  position.board[1][3] = PieceType.EMPTY_SQUARE;
  position.board[1][4] = PieceType.EMPTY_SQUARE;
  position.board[1][6] = PieceType.EMPTY_SQUARE;

  position.board[2][1] = PieceType.BLACK_PAWN;
  position.board[2][4] = PieceType.BLACK_PAWN;
  position.board[2][5] = PieceType.BLACK_KNIGHT;

  position.board[3][3] = PieceType.BLACK_PAWN;
  position.board[3][6] = PieceType.BLACK_PAWN;
  position.board[3][7] = PieceType.WHITE_PAWN;

  position.board[4][1] = PieceType.BLACK_BISHOP;
  position.board[4][2] = PieceType.WHITE_PAWN;
  position.board[4][3] = PieceType.WHITE_PAWN;

  position.board[5][2] = PieceType.WHITE_KNIGHT;
  position.board[5][3] = PieceType.WHITE_BISHOP;
  position.board[5][4] = PieceType.WHITE_PAWN;
  position.board[5][5] = PieceType.WHITE_KNIGHT;

  position.board[6][2] = PieceType.EMPTY_SQUARE;
  position.board[6][3] = PieceType.EMPTY_SQUARE;
  position.board[6][4] = PieceType.EMPTY_SQUARE;
  position.board[6][7] = PieceType.EMPTY_SQUARE;

  position.board[7][1] = PieceType.EMPTY_SQUARE;
  position.board[7][5] = PieceType.EMPTY_SQUARE;
  position.board[7][6] = PieceType.WHITE_ROOK;
  position.board[7][7] = PieceType.EMPTY_SQUARE;

  position.whites_turn = true;
  position.en_passant_square = algebraicSquareToIndex("g6");
  position.wk_castle = false;
  position.wq_castle = true;
  position.bk_castle = false;
  position.bq_castle = false;

  position.moves_since_pawn_move_or_capture = 0;
  position.move_number = 10;

  const fen = positionToFen(position);

  const expectedFen =
    "rnbq1rk1/p1p2p1p/1p2pn2/3p2pP/1bPP4/2NBPN2/PP3PP1/R1BQK1R1 w Q g6 0 10";
  expect(fen).toBe(expectedFen);
  expect(fenToPosition(fen)).toEqual(position);
});

test("index to algebraic notation and back", () => {
  expect(indexToAlgebraicSquare(0)).toBe("a8");
  expect(indexToAlgebraicSquare(1)).toBe("b8");
  expect(indexToAlgebraicSquare(8)).toBe("a7");
  expect(indexToAlgebraicSquare(17)).toBe("b6");
  expect(indexToAlgebraicSquare(63)).toBe("h1");

  expect(algebraicSquareToIndex("a8")).toBe(0);
  expect(algebraicSquareToIndex("b8")).toBe(1);
  expect(algebraicSquareToIndex("a7")).toBe(8);
  expect(algebraicSquareToIndex("b6")).toBe(17);
  expect(algebraicSquareToIndex("h1")).toBe(63);

  expect(() => algebraicSquareToIndex("az")).toThrow();
  expect(() => algebraicSquareToIndex("b0")).toThrow();
  expect(() => algebraicSquareToIndex("c9")).toThrow();
  expect(() => algebraicSquareToIndex("aa")).toThrow();
});
