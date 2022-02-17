import { useSelector } from "react-redux";
import { clientPlayingWhiteSelector } from "../../store/selectors";
import './Board.scss';

function RanksLabel() {
    const clientPlayingWhite = useSelector(clientPlayingWhiteSelector);
  
    const rankCharacters = '87654321';
    const ranks = [...(
      clientPlayingWhite ?
        rankCharacters :
        rankCharacters.split('').reverse().join('')
    )];
    return (
      <div className="ranks-label">
        {ranks.map((rank) => <span key={rank} className="rank-label">{rank}</span>)}
      </div>
  
    )
  }

  export default RanksLabel;