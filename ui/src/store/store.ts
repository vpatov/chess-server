import { assert } from "console";
import { applyMiddleware, createStore } from "redux";
import { get_legal_moves } from "../api/api";
import { WsServer } from "../api/ws";
import { algebraicSquareToIndex, fenToPosition } from "../logic/fen";
import { calculateLegalMoveMap } from "../logic/position";
import { Action, ActionType } from "../models/actions";
import { PositionInfo, getStartingPosition } from "../models/position";
import { getCleanState, State } from "../models/state";

const rootReducer = (state = getCleanState(), action: Action): State => {
  switch (action.type) {
    case ActionType.SELECT_SQUARE: {
      const payload = action.selectSquarePayload!;
      const result: Partial<State> = {};

      if (state.currentTurnClientUUID !== state.clientUUID){
        return state;
      }

      // if we're clicking the same square twice, deselect
      if (state.selectedSquare === payload.selectedSquare){
        result.selectedSquare = undefined;
        result.possibleDestinationSquares = new Set();
        // result.promotionChoice = undefined;
      }

      // if the piece on this square can move right now
      else if (state.legalMoveMap.has(payload.selectedSquare)) {
        // result.promotionChoice = undefined;
        result.selectedSquare = payload.selectedSquare;
        result.possibleDestinationSquares = new Set(state.legalMoveMap.get(payload.selectedSquare)?.keys());
      }

      else if (state.possibleDestinationSquares.has(payload.selectedSquare)){
        const lanMoves = state.legalMoveMap.get(state.selectedSquare!)?.get(payload.selectedSquare);

        if (!lanMoves){
          throw Error ("Impossible error in SELECT_SQUARE");
        }

        // if there is more than one move from src_sq to dst_sq its a promotion move
        var lanMove: string;
        if (lanMoves.length > 1){
          console.assert(lanMoves!.length === 4); 
          // just auto queen for now, until I implement a proper piece selector
          lanMove = lanMoves?.filter((move) => move.includes('Q'))[0]; 
        }
        else {
          lanMove = lanMoves![0];
        }
        WsServer.makeMove(lanMove);
        result.selectedSquare = undefined;
        result.possibleDestinationSquares = new Set();
      }

      else {
        // result.promotionChoice = undefined;
        result.selectedSquare = undefined;
        result.possibleDestinationSquares = new Set();
      }


      return {
        ...state,
        ...result
      };
    }
    case ActionType.UPDATE_FEN: {
      return {
        ...state,
        positionInfo: fenToPosition(action.updateFenPayload!),
        legalMoves: [],
      };
    }
    case ActionType.SERVER_GAME_STATE_UPDATE: {
      const update = action.serverGameStateUpdatePayload!;

      if (update.legal_moves === undefined || update.fen === undefined){
        console.log("SERVER_GAME_STATE_UPDATE is missing fields.");
        return state;
      }

      const legalMoveMap = calculateLegalMoveMap(update.legal_moves);

      const positionInfo = fenToPosition(update.fen);

      return {
        ...state,
        positionInfo: positionInfo,
        legalMoves: update.legal_moves,
        legalMoveMap: legalMoveMap,
        currentTurnClientUUID: update.currentTurnClientUUID,
        gameResult: update.result,
        movesPlayed: update.moves_played
      }
    }

    case ActionType.SERVER_GAME_STATE_INIT: {
      const payload = action.serverGameInitPayload;
      if (payload?.client_playing_white === undefined){
        console.log(payload);
        throw Error("client_playing_white needs to be present on the ServerGameStateInit payload.");
      }
      return {
        ...state,
        clientPlayingWhite: payload.client_playing_white
      };
    }

    // TODO UI needs gameInstanceUUID at all times when in the game.
    // should get it from the GET query params, not from the history

    // TODO we should have only one websocket connection to the server ideally
    // TODO WS should never send malformed request, better to have exception 
    // on client side for now
    case ActionType.REDIRECT_TO_GAME_INSTANCE: {
      return {
        ...state,
        gameInstanceUUID: action.gameInstanceUUID!
      };
    }

    case ActionType.SET_CLIENT_UUID:{
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
