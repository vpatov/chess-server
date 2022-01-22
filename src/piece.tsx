export enum PieceType {
  WHITE_ROOK = "WHITE_ROOK",
  WHITE_KNIGHT = "WHITE_KNIGHT",
  WHITE_BISHOP = "WHITE_BISHOP",
  WHITE_KING = "WHITE_KING",
  WHITE_PAWN = "WHITE_PAWN",
  WHITE_QUEEN = "WHITE_QUEEN",
  BLACK_ROOK = "BLACK_ROOK",
  BLACK_KNIGHT = "BLACK_KNIGHT",
  BLACK_BISHOP = "BLACK_BISHOP",
  BLACK_KING = "BLACK_KING",
  BLACK_PAWN = "BLACK_PAWN",
  BLACK_QUEEN = "BLACK_QUEEN",
  EMPTY_SQUARE = "EMPTY_SQUARE",
}

export const PIECE_TYPE_CLASSES: { [key in PieceType]: string } = {
  WHITE_ROOK: "white-rook",
  WHITE_KNIGHT: "white-knight",
  WHITE_BISHOP: "white-bishop",
  WHITE_KING: "white-king",
  WHITE_PAWN: "white-pawn",
  WHITE_QUEEN: "white-queen",
  BLACK_ROOK: "black-rook",
  BLACK_KNIGHT: "black-knight",
  BLACK_BISHOP: "black-bishop",
  BLACK_KING: "black-king",
  BLACK_PAWN: "black-pawn",
  BLACK_QUEEN: "black-queen",
  EMPTY_SQUARE: "empty-square",
};

function Piece(props: any) {
  const { pieceType, i, j } = props;
  const translateStyle = {
    transform: `translate(${j * 9}vh, ${i * 9}vh)`,
  };
  return <div className={`${pieceType} piece`} style={translateStyle}></div>;
}

export default Piece;
