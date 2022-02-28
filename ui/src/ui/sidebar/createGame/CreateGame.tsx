import { forwardRef, useEffect, useState } from 'react';
import './CreateGame.css';
import TimeControlSelection from './TimeControlSelection';
import { create_game } from '../../../api/api';
import { clientUUIDSelector, gameInstancesSelector } from '../../../store/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, withRouter } from 'react-router';
import { AxiosResponse } from 'axios';
import { ReduxAction, ReduxActionType } from '../../../models/reduxAction';
import { ServerGameStateUpdatePayload, ServerGameInitPayload, CreateGameRequest, ServerWsMessageType, TimeControlParams } from '../../../models/api';
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import TextField from '@mui/material/TextField';

import MuiAlert from '@mui/material/Alert';
import { get_games } from "../../../api/api";
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';


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
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const gameInstances = useSelector(gameInstancesSelector);
    const clientUUID = useSelector(clientUUIDSelector);
    const dispatch = useDispatch();
    const history = useHistory();
    
    const Alert = forwardRef(function Alert(props: any, ref: any) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });


    function handleCloseSnackbar(event: any, reason: any) {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(state => (false));
    };

    const snackbarAction = (
        <IconButton onClick={(e) => { setOpenSnackbar(false) }}>
            <CloseIcon></CloseIcon>
        </IconButton>
    );


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

    useEffect(() => {
        function onSuccessGetGames(data: AxiosResponse) {
            const action: ReduxAction = {
                type: ReduxActionType.GET_GAME_INSTANCES,
                gameInstances: data.data.games
            };
            dispatch(action);
        }
        function onFailureGetGames(e: any){
            console.error("Error when opening websocket: ", e);
            setOpenSnackbar(state => (true));
        }
        get_games(onSuccessGetGames, onFailureGetGames);
    }, [dispatch])



    return (
        <>
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
                                <li key={gameInstanceUUID}>
                                    <a href={`/game/${gameInstanceUUID}`}>{gameInstanceUUID}</a>
                                </li>
                            )}
                    </ul>
                    :
                    <></>
                }
            </div>
        </FormProvider>
        <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                action={snackbarAction}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    sx={{ width: '100%' }}
                    severity="error">
                    Can't connect to the server. Please refresh the page and try again.
                </Alert>
            </Snackbar>
        </>

    );
}

export default withRouter(CreateGame);