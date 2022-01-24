import { useState } from "react";
import { PieceType, PIECE_TYPE_CLASSES } from "../models/piece";
import Piece from "./Piece";
import { positionSelector } from "../store/selectors";
import { useSelector, useDispatch } from "react-redux";

function Position() {
  const position = useSelector(positionSelector);
  const pieceComponents = [];

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      pieceComponents.push(
        <Piece
          key={`${i}${j}`}
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
