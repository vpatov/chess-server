import './GamePlaySidebar.css';
import { useHistory } from "react-router-dom";
import { clientPlayingWhiteSelector, clientUUIDSelector, gameResultSelector, movesPlayedSelector } from '../../../store/selectors';
import { useSelector } from 'react-redux';
import { createRef, useEffect, useRef } from 'react';
import { GameResultCondition } from '../../../models/api';


function MoveList() {
    const movesPlayed = useSelector(movesPlayedSelector);

    const moveListEnd = useRef<null | HTMLDivElement>(null);
    function scrollToBottom() {
        moveListEnd.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [movesPlayed]);


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
    const clientPlayingWhite = useSelector(clientPlayingWhiteSelector);

    {/* gameResult TODO also incorporate draws */ }
    if (!gameResult) {
        return <></>;
    }

    function GameResultLabel() {
        if (!gameResult) {
            return <></>
        }
        const winnerColor: string = ((gameResult.winner === clientUUID) !== (clientPlayingWhite))
            ? 'white'
            : 'black';
        const loserColor: string = winnerColor === 'white' ? 'black' : 'white';
        var labelText = '';
        switch (gameResult.condition) {
            case GameResultCondition.CHECKMATE: {
                labelText = `Game over - ${winnerColor} wins by checkmate.`;
                break;
            }
            case GameResultCondition.TIMEOUT: {
                labelText = `${loserColor} ran out of time - ${winnerColor} wins.`;
                break;
            }
            case GameResultCondition.RESIGNATION: {
                labelText = `${loserColor} resigns - ${winnerColor} wins.`;
                break;
            }
            case GameResultCondition.DRAW: {
                labelText = `Game over - Draw.`
                break;
            }
            case GameResultCondition.STALEMATE: {
                labelText = `Draw by stalemate.`;
                break;
            }
        }
        return <label>
            {labelText}
        </label>
    }

    return (
        <div className="game-result-label">
            <GameResultLabel></GameResultLabel>
        </div>
    );

}

function GameSidebar() {
    const history = useHistory();

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

                    <MoveList></MoveList>
                    <GameResult></GameResult>

                    <div className="timers">

                    </div>
                </div>
            </div>
        </>

    );

}

export default GameSidebar;