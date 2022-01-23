function Piece(props: any) {
  const { pieceType, i, j } = props;
  const translateStyle = {
    transform: `translate(${j * 9}vh, ${i * 9}vh)`,
  };
  return <div className={`${pieceType} piece`} style={translateStyle}></div>;
}

export default Piece;
