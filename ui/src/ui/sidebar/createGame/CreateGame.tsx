import { useEffect, useState } from 'react';
import './CreateGame.css';
import TimeControlSelection from './TimeControlSelection';
import { create_game } from '../../../api/api';
import { clientUUIDSelector, gameInstancesSelector } from '../../../store/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, withRouter } from 'react-router';
import { AxiosResponse } from 'axios';
import { ReduxAction, ReduxActionType } from '../../../models/reduxAction';
import { CreateGameRequest, TimeControlParams } from '../../../models/api';
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import TextField from '@mui/material/TextField';


enum PlayerColor {
    WHITE = 'WHITE',
    BLACK = 'BLACK',
    RANDOM = 'RANDOM'
}

function PlayerColorInput() {

    const { register, setValue } = useFormContext();
    const controlName = 'playerColor';
    const playerColorInputMethods = register(controlName);
    return (
        <div className="player-color-input-container">
            <span className="player-color-input-description-label">
                I play as:
            </span>
            <select className="player-color-input"
                id="player-color-input"
                {...playerColorInputMethods}
            >
                <option value={PlayerColor.WHITE}>White</option>
                <option value={PlayerColor.BLACK}>Black</option>
                <option value={PlayerColor.RANDOM}>Random</option>
            </select>
        </div>);
}



function TimeControl(props: any) {
    return (
        <div className="time-control">
            <TimeControlSelection />
        </div>
    );
}



function CreateGame() {
    const methods = useForm();

    const gameInstances = useSelector(gameInstancesSelector);
    const clientUUID = useSelector(clientUUIDSelector);
    const dispatch = useDispatch();
    const history = useHistory();

    function onCreateGameFormSubmit(data: any) {
        const playerColor = data.playerColor === PlayerColor.RANDOM ?
            (Math.random() > 0.5 ? PlayerColor.WHITE : PlayerColor.BLACK) : data.playerColor;
        const createGameRequest: CreateGameRequest = {
            white_time_control: {
                time_left_ms: data.minutes * 60 * 1000,
                increment_ms: data.increment * 1000

            },
            black_time_control: {
                time_left_ms: data.minutes * 60 * 1000,
                increment_ms: data.increment * 1000
            },
            use_matchmaking_pool: false,
            player_requests_white: playerColor === PlayerColor.WHITE,
            requestor_client_uuid: clientUUID
        };

        function onSuccess(response: AxiosResponse) {
            const gameInstanceUUID = response.data['game_instance_uuid'];
            history.push(`/game/${gameInstanceUUID}`);
            const action: ReduxAction = { type: ReduxActionType.REDIRECT_TO_GAME_INSTANCE, gameInstanceUUID };
            dispatch(action);
        }

        create_game(createGameRequest, onSuccess, () => { });
    }

    return (
        <FormProvider {...methods} >
            <div className="create-game-form-container">
                <form onSubmit={methods.handleSubmit(onCreateGameFormSubmit)}>
                    <PlayerColorInput />
                    <TimeControl></TimeControl>
                    <button className="create-game-submit" type="submit">Create Game</button>
                </form>
            </div>
            <div className="active-games-section">
                <span className="active-games-label">Active Games: {gameInstances.length}</span>
                {gameInstances?.length ?
                    <ul className="active-games-list">
                        {
                            gameInstances?.map((gameInstanceUUID) =>
                                <li><a href={`/game/${gameInstanceUUID}`}>{gameInstanceUUID}</a></li>
                            )}
                    </ul>
                    :
                    <></>
                }
            </div>
        </FormProvider>
    );
}

export default withRouter(CreateGame);