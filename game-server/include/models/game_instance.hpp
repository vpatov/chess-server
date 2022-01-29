
#pragma once

#include "representation/move.hpp"
#include "representation/position.hpp"
#include "models/player.hpp"
#include "uuid.hpp"
#include <string>
#include <vector>



class GameInstance
{
public:
    std::string uuid;
    std::shared_ptr<Position> position;

    std::vector<MoveKey> moves_made;

    std::shared_ptr<Player> white_player;
    std::shared_ptr<Player> black_player;

    GameInstance()
    {
        uuid = generate_uuid();
        position = starting_position();
        white_player = std::make_shared<Player>();
        black_player = std::make_shared<Player>();
    }
};