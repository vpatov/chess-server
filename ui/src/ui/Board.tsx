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
import { PieceType, PIECE_TYPE_CLASSES } from "../models/piece";
import Piece from "./Piece";

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

function PromotionChoice(props: any) {

  const file = { props };
  const clientPlayingWhite = useSelector(clientPlayingWhiteSelector);

  const white_choices = [
    PieceType.WHITE_QUEEN,
    PieceType.WHITE_ROOK,
    PieceType.WHITE_KNIGHT,
    PieceType.WHITE_BISHOP
  ];
  const black_choices = [
    PieceType.BLACK_QUEEN,
    PieceType.BLACK_ROOK,
    PieceType.BLACK_KNIGHT,
    PieceType.BLACK_BISHOP
  ];

  const choices = clientPlayingWhite ? white_choices : black_choices;

  // TODO this doesnt look correct as of now
  return (
    <>
      <div className="promotion-choice">
        {choices.map((choice, index) =>
          <div style={{top: `${index*12.5}%`, left: '87.5%'}}>
            <Piece>
              key={index}
              pieceType={PIECE_TYPE_CLASSES[choice]}
              i={`${clientPlayingWhite ? index : 7 - index}${file}`}
              j={file}
            </Piece>
          </div>
        )}
      </div>
    </>
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
  // const promotionChoice = useSelector(promotionChoiceSelector);

  const rows = [];
  for (var i = 0; i < 8; i++) {
    rows.push(<Row key={i} rank={i}></Row>);
  }
  return (
    <>
      <div>
        {/* {promotionChoice !== undefined ? <PromotionChoice></PromotionChoice> : <></>} */}
        <div className="board">{rows}</div>
        <Position></Position>
        <FenInput></FenInput>
      </div>

    </>
  );
}


export default Board;
