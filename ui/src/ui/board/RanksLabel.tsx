import { useSelector } from "react-redux";
import { clientPlayingWhiteSelector } from "../../store/selectors";
import './Board.scss';

function RanksLabel() {
    const clientPlayingWhite = useSelector(clientPlayingWhiteSelector);
  
    const fileCharacters = '87654321';
    const files = [...(
      clientPlayingWhite ?
        fileCharacters :
        fileCharacters.split('').reverse().join('')
    )];
    return (
      <div className="ranks-label">
        {files.map((file) => <span className="rank-label">{file}</span>)}
      </div>
  
    )
  }

  export default RanksLabel;