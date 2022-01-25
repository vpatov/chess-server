#include "game_instance.hpp"
#include "uuid.hpp"
#include "representation/position.hpp"
#include <unordered_map>
#include <memory>




// class Player
// {
//     uint64_t time_left_ms;
//     bool is_white;
// };

// class GameInstance
// {
//     std::string uuid;
//     std::shared_ptr<Position> position;

//     std::vector<MoveKey> moves;

//     Player white_player;
//     Player black_player;
// };

std::unordered_map<std::string, std::shared_ptr<GameInstance>> game_instances;

void create_game_instance(){
    auto gameInstance = std::make_shared<GameInstance>();
    game_instances[gameInstance->uuid] = gameInstance;
}
