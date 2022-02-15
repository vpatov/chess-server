import { useDispatch, useSelector } from "react-redux";
import { ReduxAction, ReduxActionType } from "../../models/reduxAction";
import { clientPlayingWhiteSelector, kingInCheckSquareSelector, movesPlayedSelector, possibleDestinationSquaresSelector, selectedSquareSelector, squaresOfLastPlayedMoveSelector } from "../../store/selectors";
import "./Square.sass";

function Square(props: any) {
  const { dark, rank, file } = props;
  const clientPlayingWhite = useSelector(clientPlayingWhiteSelector);
  const selectedSquare = useSelector(selectedSquareSelector);
  const possibleDestinationSquares = useSelector(possibleDestinationSquaresSelector);
  const squaresOfLastPlayedMoves = useSelector(squaresOfLastPlayedMoveSelector);
  const kingInCheckSquare = useSelector(kingInCheckSquareSelector);
  const dispatch = useDispatch();

  var squareIndex = (rank * 8) + file;
  const thisSquare = clientPlayingWhite ? squareIndex : 63 - squareIndex;
  const squarePartOfLastMove = squaresOfLastPlayedMoves.includes(thisSquare);

  const colorClass = dark ? "dcol" : "lcol";
  const selectHighlightClass = dark ? 'dshcol' : 'lshcol';
  const lastMoveClass = dark ? 'dlmcol' : 'llmcol';
  const kingInCheckClass = 'king-in-check';

  function onClickFn() {
    const action: ReduxAction = {
      type: ReduxActionType.SELECT_SQUARE,
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
        thisSquare === selectedSquare ? selectHighlightClass : '',
        squarePartOfLastMove ? lastMoveClass : '',
      ].join(" ")}>
      <div
        className={[
          possibleDestinationSquares.has(thisSquare) ? "possible-destination-square" : "",
          kingInCheckSquare === thisSquare ? "king-in-check" : ""
        ].join(" ")}>
      </div>
    </div>
  );
}

export default Square;