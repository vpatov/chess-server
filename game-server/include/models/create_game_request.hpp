#pragma once
#include "models/time_control.hpp"

struct CreateGameRequest {
    TimeControl white_time_control;
    TimeControl black_time_control;
    bool use_matchmaking_pool;
    bool player_requests_white;
    std::string requestor_client_uuid;
};