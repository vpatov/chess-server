#pragma once
#include "models/time_control.hpp"

enum ActionType {
  START_GAME,
  MAKE_MOVE,
  RESIGN,
  OFFER_DRAW,
  ACCEPT_DRAW_OFFER,
  TAKE_BACK_DRAW_OFFER,
  DECLINE_DRAW_OFFER
};

enum ServerMessageType {
  GAME_STATE_UPDATE,
  GAME_INIT,
  GAME_NOT_FOUND
};

const std::string messageTypeString[] = {
  "GAME_STATE_UPDATE",
  "GAME_INIT",
  "GAME_NOT_FOUND"
};

struct GameInitPayload {
  bool client_playing_white;
  // time control info
};

struct ServerWsMessage {
  ServerMessageType message_type;
  std::string payload;
};

struct ClientWsMessage {
    ActionType type;
    std::string payload;

    ClientWsMessage(ActionType type, std::string payload) : type(type), payload(payload) {}
};

struct CreateGameRequest {
    TimeControl white_time_control;
    TimeControl black_time_control;
    bool use_matchmaking_pool;
    bool player_requests_white;
    std::string requestor_client_uuid;
};

