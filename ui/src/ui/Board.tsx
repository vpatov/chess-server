import React, { useState } from "react";
import "./Board.css";
import "./Pieces.css";
import Position from "./Position";
import { useSelector, useDispatch } from "react-redux";
import { selectedSquareSelector, legalMovesSelector, possibleDestinationSquaresSelector } from "../store/selectors";
import { Action, ActionType, SelectSquarePayload } from "../models/actions";
import FenInput from "./FenInput";
import { algebraicSquareToIndex } from "../logic/fen";
import { calculateLegalMoveMap } from "../logic/position";

function Square(props: any) {
  const { dark, rank, file } = props;
  const thisSquare = (rank * 8) + file;


  const selectedSquare = useSelector(selectedSquareSelector);
  const possibleDestinationSquares = useSelector(possibleDestinationSquaresSelector);
  const legalMoves = useSelector(legalMovesSelector);
  const dispatch = useDispatch();

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

    // const legalMoveMap = calculateLegalMoveMap(legalMoves);
    // if (legalMoveMap.has(thisSquare)) {
    //   const action: Action = {
    //     type: ActionType.SELECT_SQUARE,
    //     selectSquarePayload: {
    //       selectedSquare: thisSquare,
    //       possibleDestinationSquares: legalMoveMap.get(thisSquare)!
    //     }
    //   }
    //   dispatch(action);
    // }
    // else if ()
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
  const whiteFirst = rank % 2 === 0;
  const squares = [];
  for (var i = 0; i < 8; i++) {
    squares.push(
      <Square key={i} dark={i % 2 !== (whiteFirst ? 0 : 1)} rank={rank} file={i}></Square>
    );
  }
  return <div className="row">{squares}</div>;
}

function Board() {
  const rows = [];
  for (var i = 0; i <= 7; i++) {
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
