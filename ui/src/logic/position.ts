import { LANMove } from "../models/fen";
import { algebraicSquareToIndex } from "./fen";
import { MoveMap } from "../models/state";

export function calculateLegalMoveMap(legalMoves: Array<LANMove>): MoveMap {
  const legalMoveMap: MoveMap = new Map();
  for (const move of legalMoves) {
    const src_square = algebraicSquareToIndex(move.substring(0, 2));
    const dst_square = algebraicSquareToIndex(move.substring(2, 4));


    if (!legalMoveMap.get(src_square)) {
      legalMoveMap.set(src_square, new Map<number, string[]>());
    }
    if (!legalMoveMap.get(src_square)!.get(dst_square)){
      legalMoveMap.get(src_square)!.set(dst_square,[]);
    }
    legalMoveMap.get(src_square)!.get(dst_square)!.push(move);
  }
  return legalMoveMap;
}


export function getSquaresOfLastPlayedMove(movesPlayed: string[]): [number, number]{
  if (movesPlayed.length === 0){
    return [-1,-1];
  }
  const lastMove = movesPlayed[movesPlayed.length - 1];
  const src_square = algebraicSquareToIndex(lastMove.substring(0, 2));
  const dst_square = algebraicSquareToIndex(lastMove.substring(2, 4));

  return [src_square, dst_square];
}

