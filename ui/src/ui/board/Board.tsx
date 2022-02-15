import React, { useState } from "react";
import "./Board.scss";
import FenLabel from "./FenLabel";
import Square from "./Square";
import Position from "./Position";



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
        <FenLabel></FenLabel>
      </div>

    </>
  );
}


export default Board;
