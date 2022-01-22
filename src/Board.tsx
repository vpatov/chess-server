import React from "react";
import "./Board.css";
import "./Pieces.css";
import Position from "./Position";

function Square(props: any) {
  const { dark } = props;
  return (
    <div className={"square " + (dark ? "dark-square" : "light-square")}></div>
  );
}

function Row(props: any) {
  const { rowNum } = props;
  const whiteFirst = rowNum % 2 === 0;
  const squares = [];
  for (var i = whiteFirst ? 0 : 1; i <= (whiteFirst ? 7 : 8); i++) {
    squares.push(<Square key={i} dark={i % 2 !== 0} squareNum={i}></Square>);
  }
  console.log(squares);
  return <div className="row">{squares}</div>;
}

function Board() {
  const rows = [];
  for (var i = 0; i <= 7; i++) {
    rows.push(<Row key={i} rowNum={i}></Row>);
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
