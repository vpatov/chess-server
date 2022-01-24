import React from "react";
import "./App.css";
import Board from "./ui/Board";
import FenInput from "./ui/FenInput";

function App() {
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
