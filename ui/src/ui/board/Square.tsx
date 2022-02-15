import { useDispatch, useSelector } from "react-redux";
import { ReduxAction, ReduxActionType } from "../../models/reduxAction";
import { clientPlayingWhiteSelector, possibleDestinationSquaresSelector, selectedSquareSelector } from "../../store/selectors";

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
          selectedSquare === thisSquare ? highlightClass : colorClass,
        ].join(" ")}
      >
        <div className={possibleDestinationSquares.has(thisSquare) ? "possible-destination-square" : ""}>
        </div>
      </div>
    );
  }

  export default Square;