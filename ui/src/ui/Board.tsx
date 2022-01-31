import React, { useState } from "react";
import "./Board.css";
import "./Pieces.css";
import Position from "./Position";
import { useSelector, useDispatch } from "react-redux";
import { selectedSquareSelector, legalMovesSelector } from "../store/selectors";
import { Action, ActionType } from "../models/actions";
import FenInput from "./FenInput";
import { algebraicSquareToIndex } from "../logic/fen";

function Square(props: any) {
  const { dark, rank, file } = props;
  const thisSquare = rank * 8 + file;

  const selectedSquare = useSelector(selectedSquareSelector);
  const legalMoves = useSelector(legalMovesSelector);
  const dispatch = useDispatch();

  const colorClass = dark ? "dark-square" : "light-square";
  const highlightClass = dark
    ? "dark-square-highlighted"
    : "light-square-highlighted";

  function onClickFn() {
    const possibleStartingSquares = new Set<number>();
    for (const move of legalMoves) {
      possibleStartingSquares.add(algebraicSquareToIndex(move.substring(0, 2)));
    }
    // TODO some interesting bug here, selection of a2 causes h3 to also be selected.
    if (possibleStartingSquares.has(thisSquare)) {
      dispatch({ type: ActionType.SELECT_SQUARE, payload: thisSquare });
    }
  }

  return (
    <div
      onClick={() => onClickFn()}
      className={[
        "square",
        selectedSquare === thisSquare ? highlightClass : colorClass,
      ].join(" ")}
    ></div>
  );
}

function Row(props: any) {
  const { rank } = props;
  const whiteFirst = rank % 2 === 0;
  const squares = [];
  for (var i = whiteFirst ? 0 : 1; i <= (whiteFirst ? 7 : 8); i++) {
    squares.push(
      <Square key={i} dark={i % 2 !== 0} rank={rank} file={i}></Square>
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
