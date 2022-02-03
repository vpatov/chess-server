import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams  } from "react-router";
import { WsServer } from "../api/ws";
import { ActionType, Action, ServerGameStateUpdatePayload } from "../models/actions";
import { GameInstanceUUID } from "../models/uuid";
import Board from "./Board";
import GameSidebar from "./GameSidebar";


function Game() {

    const { gameInstanceUUID } = useParams() as any;
    const dispatch = useDispatch();
    const [gameLoaded, setGameLoaded] = useState(false);




    useEffect(() => {
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