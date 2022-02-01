import { LANMove } from "../models/fen";
import { algebraicSquareToIndex } from "./fen";

export function calculateLegalMoveMap( legalMoves: Array<LANMove>){
    const legalMoveMap = new Map<number, Set<number>>();
    for (const move of legalMoves) {
        const src_square = algebraicSquareToIndex(move.substring(0, 2));
        const dst_square = algebraicSquareToIndex(move.substring(2, 4));
    
        if (!legalMoveMap.get(src_square)) {
          legalMoveMap.set(src_square, new Set<number>());
        }
        legalMoveMap.get(src_square)!.add(dst_square);
      }
    return legalMoveMap;
}

