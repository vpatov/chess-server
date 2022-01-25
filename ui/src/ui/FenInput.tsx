import React, { useState } from "react";
import "./Board.css";
import "./FenInput.css";
import Position from "./Position";
import { useSelector, useDispatch } from "react-redux";
import { selectedSquareSelector } from "../store/selectors";
import { Action, ActionType } from "../models/actions";
import { FenString, STARTING_FEN } from "../models/fen";
import { is } from "immer/dist/internal";
import { isValidFen } from "../logic/fen";

function FenInput() {
  const [fenString, setFenString] = useState(STARTING_FEN);
  const [isCurrentFenValid, setIsCurrentFenValid] = useState(true);
  const dispatch = useDispatch();

  function processFen(fen: FenString) {
    setFenString(fen);
    const isValid: boolean = isValidFen(fen);
    setIsCurrentFenValid(isValid);
    if (isValid) {
      dispatch({ type: ActionType.UPDATE_POSITION, payload: fen });
    }
  }

  return (
    <div className="fen-input-container">
      <input
        className={`fen-input ${isCurrentFenValid ? "" : "invalid-fen"}`}
        type="text"
        defaultValue={fenString}
        onChange={(e) => processFen(e.target.value)}
      ></input>
    </div>
  );
}

export default FenInput;
