#pragma once

#include "representation/move.hpp"
#include "representation/position.hpp"
#include "uuid.hpp"

class Player
{
    uint64_t time_left_ms;
    bool is_white;
};

class GameInstance
{
public:
    std::string uuid;
    std::shared_ptr<Position> position;

    std::vector<MoveKey> moves;

    Player white_player;
    Player black_player;

    GameInstance()
    {
        uuid = generate_uuid();
        position = starting_position();
    }
};
