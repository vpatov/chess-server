import React, { useState } from "react";
import "./Board.css";
import "./FenLabel.css";
import { useSelector } from "react-redux";
import { fenStringSelector } from "../../store/selectors";

function FenLabel() {
  const fenString = useSelector(fenStringSelector);

  return (
    <div className="fen-label-container">
      <input
        className={`fen-label`}
        type="text"
        value={fenString}
        readOnly
        onFocus={(e) => e.target.select()}
      ></input>
    </div>
  );
}

export default FenLabel;
