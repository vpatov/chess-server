import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams  } from "react-router";
import { WsServer } from "../api/ws";
import { generateUUID } from "../logic/uuid";
import { ActionType, Action, ServerGameStateUpdatePayload } from "../models/actions";
import { CLIENT_UUID_KEY } from "../models/constants";
import { GameInstanceUUID } from "../models/uuid";
import Board from "./Board";
import GameSidebar from "./GameSidebar";


function Game() {

    const { gameInstanceUUID } = useParams() as any;
    const dispatch = useDispatch();
    const [gameLoaded, setGameLoaded] = useState(false);




    useEffect(() => {
        const localStorageClientUUID = window.localStorage.getItem(CLIENT_UUID_KEY);
        if (!localStorageClientUUID) {
          const clientUUID = generateUUID();
          window.localStorage.setItem(CLIENT_UUID_KEY, clientUUID);
          const action: Action =  {type: ActionType.SET_CLIENT_UUID, clientUUID: clientUUID };
          dispatch(action);
        }
        else {
          const action: Action =  {type: ActionType.SET_CLIENT_UUID, clientUUID: localStorageClientUUID };
          dispatch(action);
        }
        
        const onReceiveNewGame = (update: ServerGameStateUpdatePayload) => {
            const action: Action = {
                type: ActionType.SERVER_GAME_STATE_UPDATE,
                serverGameStateUpdatePayload: update
            }
            dispatch(action);
            if (!gameLoaded) {
                setGameLoaded(true);
            }

        };

        const action: Action = {type:ActionType.REDIRECT_TO_GAME_INSTANCE, gameInstanceUUID};
        dispatch(action);

        const succ = WsServer.openWs(gameInstanceUUID as GameInstanceUUID);
        if (succ) {
            WsServer.subscribe('serverGameStateUpdate', onReceiveNewGame);
        }

    }, [dispatch, gameInstanceUUID, gameLoaded]);

    return (
        <>
            <Board />
            <GameSidebar />
        </>

    );
}

export default Game;