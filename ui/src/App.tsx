import React from "react";
import { get_status } from "./api/api";
import "./App.css";
import Board from "./ui/Board";
import FenInput from "./ui/FenInput";

function App() {
  get_status();
  return (
    <div className="App">
      <div className="app-container">
        <Board></Board>
        <FenInput></FenInput>
      </div>
    </div>
  );
}

export default App;
