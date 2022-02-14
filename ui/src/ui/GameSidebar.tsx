import './GameSidebar.css';
import { useHistory } from "react-router-dom";
import { clientPlayingWhiteSelector, clientUUIDSelector, gameResultSelector } from '../store/selectors';
import { useSelector } from 'react-redux';
function GameSidebar() {
    const history = useHistory();

    const gameResult = useSelector(gameResultSelector);
    const clientUUID = useSelector(clientUUIDSelector);
    const clientPlayingWhite = useSelector(clientPlayingWhiteSelector);

    const routeChange = () => {
        history.push('/');
    }
    return (
        <>

            <div className="game-sidebar-container">

                <div>
                    <button className="game-sidebar-home-button" 
                    onClick={routeChange}>
                        Home
                    </button>
                    {gameResult !== undefined ?
                        <div className="game-result-label">
                            GAME OVER! {gameResult.winner === clientUUID ? 'YOU WIN!' : "you lost :("}
                        </div> :
                        <></>
                    }
                </div>
            </div>
        </>

    );

}

export default GameSidebar;