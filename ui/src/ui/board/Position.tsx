import { useState } from "react";
import { PieceType, PIECE_TYPE_CLASSES } from "../../models/piece";
import Piece from "./Piece";
import { positionSelector,clientPlayingWhiteSelector } from "../../store/selectors";
import { useSelector, useDispatch } from "react-redux";
import "./Piece.css";

function Position() {
  const position = useSelector(positionSelector);
  const clientPlayingWhite = useSelector(clientPlayingWhiteSelector);
  const pieceComponents = [];

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      pieceComponents.push(
        <Piece
          key={`${i}${j}`}
          pieceType={PIECE_TYPE_CLASSES[clientPlayingWhite ? position.board[i][j] : position.board[7-i][7-j]]}
          i={i}
          j={j}
        ></Piece>
      );
    }
  }
  return <>{pieceComponents}</>;
}

export default Position;

