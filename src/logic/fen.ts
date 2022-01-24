import { PositionInfo } from "../models/position";
import { PieceType } from "../models/piece";
import {
  CHARACTER_TO_PIECE,
  FenString,
  PIECE_TO_CHARACTER,
} from "../models/fen";
import assert from "assert/strict";

export function algebraicSquareToIndex(square: string): number {
  assert(square.length == 2);
  assert(square.charCodeAt(0) >= 97 && square.charCodeAt(0) <= 104);
  assert(square.charCodeAt(1) >= 49 && square.charCodeAt(1) <= 56);
  const file = square.charCodeAt(0) - 97;
  const rank = square.charCodeAt(1) - 49;
  return (7 - rank) * 8 + file;
}

export function indexToAlgebraicSquare(square: number): string {
  const rank = Math.floor(square / 8);
  const file = square % 8;

  return `${String.fromCharCode(file + 97)}${String.fromCharCode(
    7 - rank + 49
  )}`;
}

export function fenToPosition(fen: FenString): PositionInfo {
  const board = [];
  const fenComponents = fen.split(" ");

  const boardComponent = fenComponents[0];
  var row: Array<PieceType> = [];
  for (var ch of boardComponent) {
    if (ch === "/") {
      board.push(row);
      row = [];
      continue;
    }

    const num_squares = Number(ch);
    if (!isNaN(num_squares)) {
      for (var _ = 0; _ < num_squares; _++) {
        row.push(PieceType.EMPTY_SQUARE);
      }
    } else {
      row.push(CHARACTER_TO_PIECE[ch]);
    }
  }
  board.push(row);

  return {
    board,
    whites_turn: fenComponents[1] == "w",
    wk_castle: fenComponents[2].includes("K"),
    wq_castle: fenComponents[2].includes("Q"),
    bk_castle: fenComponents[2].includes("k"),
    bq_castle: fenComponents[2].includes("q"),
    en_passant_square:
      fenComponents[3] === "-" ? 0 : algebraicSquareToIndex(fenComponents[3]),
    moves_since_pawn_move_or_capture: Number(fenComponents[4]),
    move_number: Number(fenComponents[5]),
  };
}

export function positionToFen(position: PositionInfo): FenString {
  const fenBuilder: Array<string> = [];

  // where the pieces are
  for (let i = 0; i < 8; i++) {
    var emptySquares: number = 0;
    for (let j = 0; j < 8; j++) {
      const piece = position.board[i][j];

      if (piece === PieceType.EMPTY_SQUARE) {
        emptySquares += 1;
        continue;
      }

      if (emptySquares > 0) {
        fenBuilder.push(`${emptySquares}`);
        emptySquares = 0;
      }
      fenBuilder.push(PIECE_TO_CHARACTER[piece]);
    }
    if (emptySquares > 0) {
      fenBuilder.push(`${emptySquares}`);
      emptySquares = 0;
    }
    fenBuilder.push(i === 7 ? " " : "/");
  }

  // whose turn it is
  fenBuilder.push(position.whites_turn ? "w " : "b ");

  // castling rights
  if (position.wk_castle) {
    fenBuilder.push("K");
  }
  if (position.wq_castle) {
    fenBuilder.push("Q");
  }
  if (position.bk_castle) {
    fenBuilder.push("k");
  }
  if (position.bq_castle) {
    fenBuilder.push("q");
  }

  if (fenBuilder.at(fenBuilder.length - 1) != " ") {
    fenBuilder.push(" ");
  }

  fenBuilder.push(
    position.en_passant_square === 0
      ? "- "
      : `${indexToAlgebraicSquare(position.en_passant_square)} `
  );

  fenBuilder.push(`${position.moves_since_pawn_move_or_capture} `);
  fenBuilder.push(`${position.move_number}`);

  return fenBuilder.join("");
}
