import { useSelector } from "react-redux";
import { PieceType, PIECE_TYPE_CLASSES } from "../../models/piece";
import { clientPlayingWhiteSelector } from "../../store/selectors";
import Piece from "./Piece";

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

  export default PromotionChoice;