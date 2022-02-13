import React, { useState } from "react";
import "./Board.css";
import "./Pieces.css";
import Position from "./Position";
import { useSelector, useDispatch } from "react-redux";
import { selectedSquareSelector, legalMovesSelector, possibleDestinationSquaresSelector, clientUUIDSelector, currentTurnClientUUIDSelector, clientPlayingWhiteSelector } from "../store/selectors";
import { Action, ActionType, SelectSquarePayload } from "../models/actions";
import FenInput from "./FenInput";
import { algebraicSquareToIndex } from "../logic/fen";
import { calculateLegalMoveMap } from "../logic/position";

function Square(props: any) {
  const { dark, rank, file } = props;
  const clientPlayingWhite = useSelector(clientPlayingWhiteSelector);
  const selectedSquare = useSelector(selectedSquareSelector);
  const possibleDestinationSquares = useSelector(possibleDestinationSquaresSelector);
  const dispatch = useDispatch();

  var squareIndex = (rank * 8) + file;
  const thisSquare = clientPlayingWhite ? squareIndex : 63 - squareIndex;



  

  const colorClass = dark ? "dark-square" : "light-square";
  const highlightClass = dark
    ? "dark-square-highlighted"
    : "light-square-highlighted";

  function onClickFn() {

    const action: Action = {
      type: ActionType.SELECT_SQUARE,
      selectSquarePayload: {
        selectedSquare: thisSquare
      }
    };
    dispatch(action);
  }

  return (
    <div
      onClick={() => onClickFn()}
      className={[
        "square",
        colorClass,
        selectedSquare === thisSquare ? highlightClass : colorClass,
      ].join(" ")}
    >
      <div className={possibleDestinationSquares.has(thisSquare) ? "possible-destination-square" : ""}>
      </div>
    </div>
  );
}

function Row(props: any) {
  const { rank } = props;
  const squares = [];
  for (var i = 0; i < 8; i++) {
    squares.push(
      <Square key={i} dark={i % 2 !== ((rank % 2 === 0) ? 0 : 1)} rank={rank} file={i}></Square>
    );
  }
  return <div className="row">{squares}</div>;
}

function Board() {
  const rows = [];
  for (var i = 0; i < 8; i++) {
    rows.push(<Row key={i} rank={i}></Row>);
  }
  return (
    <>
      <div>
        <div className="board">{rows}</div>
        <Position></Position>
        <FenInput></FenInput>
      </div>

    </>
  );
}

export default Board;
