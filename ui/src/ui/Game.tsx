import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import { WsServer } from "../api/ws";
import { ActionType, Action, ServerGameStateUpdate } from "../models/actions";
import { GameInstanceUUID } from "../models/uuid";
import Board from "./Board";
import GameSidebar from "./GameSidebar";


function Game() {

    const { gameInstanceUUID } = useParams() as any;
    const dispatch = useDispatch();
    const [gameLoaded, setGameLoaded] = useState(false);




    useEffect(() => {
        const onReceiveNewGame = (update: ServerGameStateUpdate) => {
            const action: Action = {
                type: ActionType.SERVER_GAME_STATE_UPDATE,
                payload: undefined,
                serverGameStateUpdate: update
            }
            dispatch(action);
            if (!gameLoaded){
             setGameLoaded(true);
            }

        };

        const succ = WsServer.openWs(gameInstanceUUID as GameInstanceUUID);
        if (succ) {
            WsServer.subscribe('serverGameStateUpdate', onReceiveNewGame);
        }

    },[]);

    return (
        <>
            <Board />
            <GameSidebar />
        </>

    );
}

export default Game;