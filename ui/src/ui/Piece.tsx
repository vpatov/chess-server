function Piece(props: any) {
  const { pieceType, i, j } = props;
  const translateStyle = {
    transform: `translate(${j * 10 + 0.2}vh, ${i * 10 + 0.2}vh)`,
  };
  return <div className={`${pieceType} piece`} style={translateStyle}></div>;
}

export default Piece;
