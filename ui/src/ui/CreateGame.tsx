import { useState } from 'react';
import './CreateGame.css';
import TimeControlInput from './TimeControlInput';
import { CreateGameRequest, TimeControl, create_game } from '../api/api';
import { clientUUIDSelector } from '../store/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router';
import { AxiosResponse } from 'axios';
import { Action, ActionType } from '../models/actions';


enum PlayerColor {
    WHITE = 'WHITE',
    BLACK = 'BLACK',
    RANDOM = 'RANDOM'
}

function durationToMilliseconds(duration: string) {
    const parts = duration.split(":");
    const minutes = Number(parts[0]);
    const seconds = Number(parts[1]);
    return ((minutes * 60) + seconds) * 1000;
}

function CreateGame(props: any) {

    const dispatch = useDispatch();
    const { history } = props;
    const clientUUID = useSelector(clientUUIDSelector);
    

    const [useSameTimeControl, setUseSameTimeControl] = useState(true);
    const [playerColor, setPlayerColor] = useState(PlayerColor.WHITE);

    const [whiteClock, setWhiteClock] = useState("5:00");
    const [whiteIncrement, setWhiteIncrement] = useState(3);

    const [blackClock, setBlackClock] = useState("5:00");
    const [blackIncrement, setBlackIncrement] = useState(3);

    function onSuccess(response: AxiosResponse) {
        const gameInstanceUUID = response.data['game_instance_uuid'];
        history.push(`/game/${gameInstanceUUID}`);
        const action: Action = {type: ActionType.REDIRECT_TO_GAME_INSTANCE, gameInstanceUUID};
        dispatch(action);
    }

    function onError() {
        console.log("create_game failed");
    }

    function onClickCreateGame() {
        const request: CreateGameRequest = {
            white_time_control: {
                time_left_ms: durationToMilliseconds(whiteClock),
                increment_ms: whiteIncrement * 1000
            },
            black_time_control: {
                time_left_ms: durationToMilliseconds(useSameTimeControl ? whiteClock : blackClock),
                increment_ms: (useSameTimeControl ? whiteIncrement : blackIncrement) * 1000
            },
            use_matchmaking_pool: false,
            player_requests_white: (playerColor === PlayerColor.RANDOM)
                ? (Math.random() > 0.5)
                : (playerColor === PlayerColor.WHITE),
            requestor_client_uuid: clientUUID
        }

        create_game(request, onSuccess, onError);

    }


    function BothTimeControls() {
        return <>
            <div style={{ 'display': 'flex', 'flexDirection': 'row' }}>
                <span style={{ width: '5vw' }}>
                    White:
                </span>

                <TimeControlInput
                    clockSeconds={whiteClock}
                    setClockSeconds={setWhiteClock}
                    increment={whiteIncrement}
                    setIncrement={setWhiteIncrement}>
                </TimeControlInput>
            </div>
            <div style={{ 'display': 'flex', 'flexDirection': 'row' }}>
                <span style={{ width: '5vw' }}>
                    Black:
                </span>
                <TimeControlInput
                    clockSeconds={blackClock}
                    setClockSeconds={setBlackClock}
                    increment={blackIncrement}
                    setIncrement={setBlackIncrement}>
                </TimeControlInput>
            </div>
        </>

    }

    function SingleTimeControl() {
        return <>
            <div style={{ 'display': 'flex', 'flexDirection': 'row' }}>
                <span style={{ width: '4vw' }}>
                </span>
                <TimeControlInput
                    clockSeconds={whiteClock}
                    setClockSeconds={setWhiteClock}
                    increment={whiteIncrement}
                    setIncrement={setWhiteIncrement}>
                </TimeControlInput>
            </div>
        </>

    }

    return <div className="create-game-container">
        <div style={{ 'display': 'flex' }}>
            <span>
                I play as:
            </span>
            <select
                name="player-color"
                id="player-color-input"
                value={playerColor}
                onChange={(e) => { setPlayerColor(e.target.value as PlayerColor) }}>
                <option value={PlayerColor.WHITE}>White</option>
                <option value={PlayerColor.BLACK}>Black</option>
                <option value={PlayerColor.RANDOM}>Random</option>
            </select>
        </div>
        <div style={{ 'display': 'flex' }}>
            <span>
                Same time control for both:
            </span>
            <input
                type="checkbox"
                id="same-time-control"
                name="same-time-control"
                checked={useSameTimeControl}
                onChange={(e) => { setUseSameTimeControl(e.target.checked) }}>
            </input>
        </div>
        <div>
            <div style={{ 'display': 'flex', 'flexDirection': 'row' }}>
                <span style={{ 'marginLeft': '5vw', 'marginRight': '4vw' }}>
                    Clock
                </span>
                <span>
                    Increment (seconds)
                </span>
            </div>
            {useSameTimeControl ? SingleTimeControl() : BothTimeControls()}
        </div>
        <button onClick={onClickCreateGame}>
            Create Game
        </button>
    </div>
}


export default withRouter(CreateGame);