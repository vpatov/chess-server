import './GamePlaySidebar.css';
import { useHistory } from "react-router-dom";
import { clientPlayingWhiteSelector, clientUUIDSelector, gameResultSelector, movesPlayedSelector } from '../../../store/selectors';
import { useSelector } from 'react-redux';
import { createRef, useEffect, useRef } from 'react';


function MoveList() {
    const movesPlayed = useSelector(movesPlayedSelector);

    const moveListEnd  = useRef<null | HTMLDivElement>(null);
    function scrollToBottom(){
        moveListEnd.current?.scrollIntoView({ behavior: "smooth" });
      }
      
      useEffect(() => {
          scrollToBottom();
      },[movesPlayed]);


    const movesList = [];
    for (var i = 0; i < movesPlayed.length; i += 2) {
        const s = movesPlayed[i] + ('\t' + (movesPlayed[i + 1] || ''));
        movesList.push(<li>{s}</li>);
    }
    return (
        <div className="move-list">
            <ol>
                {movesList}
            </ol>
            <div ref={moveListEnd}>
            </div>
        </div>
    );
}

function GameResult() {
    const gameResult = useSelector(gameResultSelector);
    const clientUUID = useSelector(clientUUIDSelector);

    {/* gameResult TODO also incorporate draws */ }
    if (!gameResult) {
        return <></>;
    }
    return (
        <div className="game-result-label">
            GAME OVER! {gameResult.winner === clientUUID ? 'YOU WIN!' : "you lost :("}
        </div>
    );

}

function GameSidebar() {
    const history = useHistory();

    const clientPlayingWhite = useSelector(clientPlayingWhiteSelector);

    const routeChange = () => {
        history.push('/');
    }


    // TODO make separate components for these 
    // TODO cpp timer!
    return (
        <>
            <div className="game-sidebar-container">
                <div>
                    {/* home button */}
                    <button className="game-sidebar-home-button"
                        onClick={routeChange}>
                        Home
                    </button>

                    <GameResult></GameResult>
                    <MoveList></MoveList>

                    <div className="timers">

                    </div>
                </div>
            </div>
        </>

    );

}

export default GameSidebar;