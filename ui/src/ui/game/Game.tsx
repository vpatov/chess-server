import { forwardRef, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import { generateUUID } from "../../logic/uuid";
import { ReduxActionType, ReduxAction } from "../../models/reduxAction";
import { CLIENT_UUID_KEY } from "../../models/constants";
import { ClientUUID, GameInstanceUUID } from "../../models/uuid";


import MuiAlert from '@mui/material/Alert';

import GameContainer from "./GameContainer";
import { ServerGameInitPayload, ServerGameStateUpdatePayload, ServerWsMessageType } from "../../models/api";
import Sidebar, { SidebarMode } from "../sidebar/Sidebar";
import { get_games } from "../../api/api";
import { AxiosResponse } from "axios";
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';


function Game(props: any) {
    const sidebarMode: SidebarMode = props.sidebarMode;
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const dispatch = useDispatch();




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


    function httpErrorCallback() {

    }

    useEffect(() => {
        const localStorageClientUUID = window.localStorage.getItem(CLIENT_UUID_KEY);
        if (!localStorageClientUUID) {
            const clientUUID = generateUUID();
            window.localStorage.setItem(CLIENT_UUID_KEY, clientUUID);
            const action: ReduxAction = { type: ReduxActionType.SET_CLIENT_UUID, clientUUID: clientUUID as ClientUUID };
            dispatch(action);
        }
        else {
            const action: ReduxAction = { type: ReduxActionType.SET_CLIENT_UUID, clientUUID: localStorageClientUUID as ClientUUID };
            dispatch(action);
        }

        const onESC = (ev: KeyboardEvent) => {
            if (ev.key === "Escape") {
                ev.preventDefault();
                const action: ReduxAction = {
                    type: ReduxActionType.SELECT_SQUARE,
                    selectSquarePayload: {
                        selectedSquare: 0,
                        deselect: true
                    }
                };
                dispatch(action);
            }
        };
        window.addEventListener("keydown", onESC, false);


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


    }, [dispatch]);


    return (
        <>
            <GameContainer />
            <Sidebar sidebarMode={sidebarMode} />
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

export default Game;