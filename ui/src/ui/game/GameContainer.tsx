import Board from "../board/Board";
import Position from "../board/Position";
import FilesLabel from "../board/FilesLabel";
import RanksLabel from "../board/RanksLabel";
import FenLabel from "../board/FenLabel";

function GameContainer() {
    return (
    <div>
      <Board />
      <Position />
      <FilesLabel /> 
      <RanksLabel />
      <FenLabel />
    </div>
    );
  }

  export default GameContainer;