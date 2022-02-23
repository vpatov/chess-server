import { forwardRef, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import { WsServer } from "../../api/ws";
import { generateUUID } from "../../logic/uuid";
import { ReduxActionType, ReduxAction } from "../../models/reduxAction";
import { CLIENT_UUID_KEY } from "../../models/constants";
import { ClientUUID, GameInstanceUUID } from "../../models/uuid";

import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MuiAlert from '@mui/material/Alert';

import GameContainer from "./GameContainer";
import { ServerGameInitPayload, ServerGameStateUpdatePayload, ServerWsMessageType } from "../../models/api";
import Sidebar, { SidebarMode } from "../sidebar/Sidebar";

function Game(props: any) {
    const sidebarMode: SidebarMode = props.sidebarMode;
    console.log("Game:", sidebarMode);
    const { gameInstanceUUID } = useParams() as any;
    const dispatch = useDispatch();
    const [gameLoaded, setGameLoaded] = useState(false);

    const [openSnackbar, setOpenSnackbar] = useState(false);

    function handleCloseSnackbar(event: any, reason: any) {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(state => (false));
    };

    function wsErrorCallback() {
        console.error("Error when opening websocket.");
        setOpenSnackbar(state => (true));
    }

    const Alert = forwardRef(function Alert(props: any, ref: any) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

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

        const onGameStateUpdate = (payload: ServerGameStateUpdatePayload) => {
            const action: ReduxAction = {
                type: ReduxActionType.SERVER_GAME_STATE_UPDATE,
                serverGameStateUpdatePayload: payload
            }
            dispatch(action);
            if (!gameLoaded) {
                setGameLoaded(true);
            }
        };

        const onGameInit = (payload: ServerGameInitPayload) => {
            const action: ReduxAction = {
                type: ReduxActionType.SERVER_GAME_STATE_INIT,
                serverGameInitPayload: payload
            };
            dispatch(action);
        }

        const action: ReduxAction = { type: ReduxActionType.REDIRECT_TO_GAME_INSTANCE, gameInstanceUUID };
        dispatch(action);

        WsServer.openWs(gameInstanceUUID as GameInstanceUUID, wsErrorCallback);
        WsServer.subscribe(ServerWsMessageType.GAME_STATE_UPDATE, onGameStateUpdate);
        WsServer.subscribe(ServerWsMessageType.GAME_INIT, onGameInit);

    }, [dispatch, gameInstanceUUID, gameLoaded]);

    const snackbarAction = (
        <IconButton onClick={(e) => { setOpenSnackbar(false) }}>
            <CloseIcon></CloseIcon>
        </IconButton>
    );


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