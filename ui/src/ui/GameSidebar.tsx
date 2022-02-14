import './GameSidebar.css';
import { useHistory } from "react-router-dom";
import { clientPlayingWhiteSelector, clientUUIDSelector, gameResultSelector, movesPlayedSelector } from '../store/selectors';
import { useSelector } from 'react-redux';
function GameSidebar() {
    const history = useHistory();

    const movesPlayed = useSelector(movesPlayedSelector);
    const gameResult = useSelector(gameResultSelector);
    const clientUUID = useSelector(clientUUIDSelector);
    const clientPlayingWhite = useSelector(clientPlayingWhiteSelector);

    const routeChange = () => {
        history.push('/');
    }

    const movesList = [];
    for (var i = 0; i < movesPlayed.length; i += 2) {
        const s = movesPlayed[i] + ('\t' + (movesPlayed[i + 1] || ''));
        movesList.push(<li>{s}</li>);
    }
    // TODO make separate components for these 
    return (
        <>
            <div className="game-sidebar-container">
                <div>
                    {/* home button */}
                    <button className="game-sidebar-home-button"
                        onClick={routeChange}>
                        Home
                    </button>


                    {/* gameResult TODO also incorporate draws */}
                    {gameResult !== undefined ?
                        <div className="game-result-label">
                            GAME OVER! {gameResult.winner === clientUUID ? 'YOU WIN!' : "you lost :("}
                        </div> :
                        <></>
                    }

                    {/* moveList */}
                    <div className="move-list">
                        <ol>
                            {movesList}
                        </ol>
                    </div>

                    <div className="timers">

                    </div>
                </div>
            </div>
        </>

    );

}

export default GameSidebar;