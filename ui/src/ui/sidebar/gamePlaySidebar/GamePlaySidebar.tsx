import './GamePlaySidebar.css';
import { useHistory } from "react-router-dom";
import { gameResultSelector, drawOfferSelector, movesPlayedSelector, clientPlayingWhiteSelector } from '../../../store/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import { GameResultCondition } from '../../../models/api';
import { ReduxAction, ReduxActionType } from '../../../models/reduxAction';
import FlagIcon from '@mui/icons-material/Flag';
import HomeIcon from '@mui/icons-material/Home';
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';
import TimeBankDisplay from './TimeBankDisplay';


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
        movesList.push(<li key={i}>{s}</li>);
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

    function GameResultLabel() {
        const white = 'white';
        const black = 'black';
        const winnerColor = gameResult!.winner;
        console.assert(winnerColor === white || winnerColor === black);
        const loserColor: string = (winnerColor === white) ? black : white;
        var labelText = '';
        switch (gameResult!.condition) {
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
            {gameResult !== undefined ? <GameResultLabel></GameResultLabel> : <></>}
        </div>
    );

}


function DrawResignationButtons() {
    const offerDrawLabel = "Offer Draw";
    const acceptDrawLabel = "Accept Draw";
    const declineDrawLabel = "Decline Draw";
    const rescindDrawLabel = "Rescind Draw Offer";

    const dispatch = useDispatch();
    const drawOffer = useSelector(drawOfferSelector);
    const clientPlayingWhite = useSelector(clientPlayingWhiteSelector)
    const playerColor = clientPlayingWhite ? 'white' : 'black';
    const canRescindDraw = drawOffer === playerColor;
    const canAcceptDeclineDraw = drawOffer !== '' && drawOffer !== playerColor;
    const drawLabel = canAcceptDeclineDraw ? acceptDrawLabel : (canRescindDraw ? rescindDrawLabel : offerDrawLabel);


    function resignButtonHandler(){
        const action: ReduxAction = {
            type: ReduxActionType.RESIGN_BUTTON_PRESS
        };
        dispatch(action);
    }
    function drawButtonHandler() {
        const action: ReduxAction = {
            type: ReduxActionType.DRAW_BUTTON_PRESS
        };
        dispatch(action);
    }

    function declineDrawButtonHandler() {
        const action: ReduxAction = {
            type: ReduxActionType.DECLINE_DRAW_OFFER
        };
        dispatch(action);
    }

    return <div className="draw-resignation-buttons">
        <Tooltip title="Resign">
            <button onClick={(e) => resignButtonHandler()}className="button-84"><FlagIcon></FlagIcon></button>
        </Tooltip>
        <Tooltip title={drawLabel}>
            <button
                className={
                    [
                        "button-84",
                        canAcceptDeclineDraw ? 'accept-draw-button' : '',
                        canRescindDraw ? 'rescind-draw-button' : '',
                    ].join(' ')
                } onClick={(e) => drawButtonHandler()}>½</button>
        </Tooltip>
        {canAcceptDeclineDraw ?
            <Tooltip title={declineDrawLabel}>
                <button className="button-84 decline-draw-button" onClick={(e) => declineDrawButtonHandler()}>
                    <CloseIcon />
                </button>
            </Tooltip>
            :
            <></>
        }
    </div>;
}

function NewGameButton() {
    const history = useHistory();
    const dispatch = useDispatch();

    const routeChange = () => {
        history.push('/');
        dispatch({ type: ReduxActionType.GO_HOME });

    }
    return <div className="new-game-button-container">
        <Tooltip title="New Game">
            <button onClick={routeChange} className="button-84 new-game-button"><HomeIcon></HomeIcon></button>
        </Tooltip>
    </div>;
}

function GameSidebar() {


    return (
        <>
            <div className="game-sidebar-container">
                <div className="player-names">
                    <span>
                        Anon
                    </span>
                    <span>
                        vs
                    </span>
                    <span>
                        Anon
                    </span>
                </div>
                <MoveList />
                <TimeBankDisplay />
                <GameResult />
                <DrawResignationButtons></DrawResignationButtons>
                <NewGameButton></NewGameButton>

            </div>
        </>

    );

}

export default GameSidebar;