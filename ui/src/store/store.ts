import { createStore } from "redux";
import { create_game } from "../api/api";
import { WsServer } from "../api/ws";
import { algebraicSquareToIndex, fenToPosition } from "../logic/fen";
import { calculateLegalMoveMap, getSquaresOfLastPlayedMove } from "../logic/position";
import { GameInstanceState } from "../models/api";
import { ReduxAction, ReduxActionType } from "../models/reduxAction";
import { getCleanState, State } from "../models/state";


const rootReducer = (state = getCleanState(), action: ReduxAction): State => {
    switch (action.type) {
        case ReduxActionType.SELECT_SQUARE: {
            const payload = action.selectSquarePayload!;
            const result: Partial<State> = {};

            if (state.currentTurnClientUUID !== state.clientUUID) {
                return state;
            }

            // if we're clicking the same square twice, deselect
            if (state.selectedSquare === payload.selectedSquare || payload.deselect) {
                result.selectedSquare = undefined;
                result.possibleDestinationSquares = new Set();
            }

            // if the piece on this square can move right now
            else if (state.legalMoveMap.has(payload.selectedSquare)) {
                result.selectedSquare = payload.selectedSquare;
                result.possibleDestinationSquares = new Set(state.legalMoveMap.get(payload.selectedSquare)?.keys());
            }

            else if (state.possibleDestinationSquares.has(payload.selectedSquare)) {
                const lanMoves = state.legalMoveMap.get(state.selectedSquare!)?.get(payload.selectedSquare);

                if (!lanMoves) {
                    throw Error("Impossible error in SELECT_SQUARE");
                }

                // if there is more than one move from src_sq to dst_sq its a promotion move
                var lanMove: string;
                if (lanMoves.length > 1) {
                    console.assert(lanMoves!.length === 4);
                    // just auto queen for now, until I implement a proper piece selector
                    lanMove = lanMoves?.filter((move) => move.includes('Q'))[0];
                }
                else {
                    lanMove = lanMoves![0];
                }

                // white starts the game by making the first move.
                if (state.gameInstanceState === GameInstanceState.READY_TO_START) {
                    WsServer.startGame();
                }

                WsServer.makeMove(lanMove);
                result.selectedSquare = undefined;
                result.possibleDestinationSquares = new Set();
            }

            else {
                result.selectedSquare = undefined;
                result.possibleDestinationSquares = new Set();
            }

            return {
                ...state,
                ...result
            };
        }

        case ReduxActionType.GET_GAME_INSTANCES: {
            return {
                ...state,
                gameInstances: action.gameInstances || []
            };
        }

        case ReduxActionType.GO_HOME: {
            const cleanState = getCleanState();
            return {
                ...cleanState,
                clientUUID: state.clientUUID,
                clientPlayingWhite: state.clientPlayingWhite
            };
        }

        case ReduxActionType.CREATE_GAME_FORM_SUBMIT: {
            return state;
        }

        case ReduxActionType.RESIGN_BUTTON_PRESS: {
            WsServer.resign();
            return state;
        }

        case ReduxActionType.DECLINE_DRAW_OFFER: {
            WsServer.declineDrawOffer();
            return state;
        }

        case ReduxActionType.DRAW_BUTTON_PRESS: {
            const drawOffer = state.drawOffer;
            const playerColor = state.clientPlayingWhite ? 'white' : 'black';
            if (drawOffer === playerColor) {
                // if the draw offer was made by us, pressing the button again takes back the draw.
                WsServer.rescindDrawOffer();

            }
            else if (drawOffer !== '') {
                // if the draw offer was not made by us, pressing the button accepts it.
                WsServer.acceptDrawOffer();

            }
            else {
                // if no draw offer, pressing button creates darw of
                WsServer.offerDraw();
            }
            return state;
        }

        case ReduxActionType.TIMER_TICK: {
            const timeBank = { ...state.timeBank };
            const turn = state.positionInfo.whites_turn ? "white" : "black";
            timeBank[turn] -= 1000;
            if (timeBank[turn] < 0) {
                timeBank[turn] = 0;
            }

            return {
                ...state,
                timeBank
            };
        }

        case ReduxActionType.SERVER_GAME_STATE_UPDATE: {
            const update = action.serverGameStateUpdatePayload!;

            const legalMoveMap = update.legal_moves ? calculateLegalMoveMap(update.legal_moves) : undefined;

            const positionInfo = update.fen ? fenToPosition(update.fen) : undefined;

            const kingInCheckSquare = update.king_in_check_square !== undefined
                ? algebraicSquareToIndex(update.king_in_check_square)
                : undefined;

            const newState: Partial<State> = {
                currentTurnClientUUID: update.currentTurnClientUUID,
                gameResult: update.result,
                movesPlayed: update.moves_played,
                squaresOfLastPlayedMove: getSquaresOfLastPlayedMove(update.moves_played),
                kingInCheckSquare: kingInCheckSquare,
                timeBank: update.time_control,
                gameInstanceState: update.game_instance_state,
                drawOffer: update.draw_offer || '',
                gameNotFound: false,
                clientPlayingWhite: update.whiteClientUUID === state.clientUUID,
            };

            if (positionInfo) {
                newState.positionInfo = positionInfo
            }

            // && update.game_instance_state === GameInstanceState.IN_PLAY
            if (legalMoveMap &&
                [
                    GameInstanceState.READY_TO_START,
                    GameInstanceState.IN_PLAY
                ].includes(update.game_instance_state)) {
                newState.legalMoves = update.legal_moves;
                newState.legalMoveMap = legalMoveMap;
            }
            else {
                newState.legalMoves = [];
                newState.legalMoveMap = new Map();
            }

            console.log("white: ", newState?.timeBank?.white, "black: ", newState?.timeBank?.black)

            return {
                ...state,
                ...newState
            };
        }

        case ReduxActionType.SERVER_GAME_NOT_FOUND: {
            return {
                ...state,
                gameNotFound: true
            };
        }

        // TODO UI needs gameInstanceUUID at all times when in the game.
        // should get it from the GET query params, not from the history

        // TODO we should have only one websocket connection to the server ideally
        // TODO WS should never send malformed request, better to have exception 
        // on client side for now
        case ReduxActionType.REDIRECT_TO_GAME_INSTANCE: {
            return {
                ...state,
                gameInstanceUUID: action.gameInstanceUUID!
            };
        }

        case ReduxActionType.SET_CLIENT_UUID: {
            return {
                ...state,
                clientUUID: action.clientUUID!
            };
        }
        default:
            return state;
    }
};

export const store = createStore(rootReducer);

export default store;
