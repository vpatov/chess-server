import React, { useState } from "react";
import "./Board.css";
import "./Pieces.css";
import Position from "./Position";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedSquare, clearSelectedSquare } from "./selectedSlice";

function Square(props: any) {
  const { dark, rank, file } = props;

  const thisSquare = rank * 8 + file;

  const selectedSquare = useSelector((state: any) => state.selected);
  const dispatch = useDispatch();

  // TODO LASTLEFTOFF
  // when the selected redux variable is equal to index of this square, it should be highlighted
  // clicking on this square should unhighlight it if it is highlighted
  // clicking on this square should highlight it and unhighlight other squares

  // TODO actual highlighting not working anymore

  const colorClass = dark ? "dark-square" : "light-square";
  const highlightClass = dark
    ? "dark-square-highlighted"
    : "light-square-highlighted";

  function onClickFn() {
    console.log(`onclick, for square ${thisSquare}`);
    setSelectedSquare(selectedSquare === thisSquare ? undefined : thisSquare);
    console.log(selectedSquare);
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
  console.log(squares);
  return <div className="row">{squares}</div>;
}

function Board() {
  const rows = [];
  for (var i = 0; i <= 7; i++) {
    rows.push(<Row key={i} rank={i}></Row>);
  }
  return (
    <>
      <div className="board">
        <Position></Position>
        {rows}
      </div>
    </>
  );
}

export default Board;
