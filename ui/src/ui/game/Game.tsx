import { forwardRef, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import { generateUUID } from "../../logic/uuid";
import { ReduxActionType, ReduxAction } from "../../models/reduxAction";
import { CLIENT_UUID_KEY } from "../../models/constants";
import { ClientUUID, GameInstanceUUID } from "../../models/uuid";

import GameContainer from "./GameContainer";
import Sidebar, { SidebarMode } from "../sidebar/Sidebar";



function Game(props: any) {
    const sidebarMode: SidebarMode = props.sidebarMode;
    const dispatch = useDispatch();

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
    }, [dispatch]);


    return (
        <>
            <GameContainer />
            <Sidebar sidebarMode={sidebarMode} />
        </>
    );
}

export default Game;