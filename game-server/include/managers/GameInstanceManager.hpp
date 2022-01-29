#pragma once

#include <boost/format.hpp>
#include "DBConnectionManager.hpp"
#include "models/game_instance.hpp"
#include "models/create_game_request.hpp"
#include "move_generation.hpp"
#include "representation/move.hpp"
#include "uuid.hpp"
#include <memory>
#include <stdexcept>

using gameptr = std::shared_ptr<GameInstance>;
class GameInstanceManager
{
public:
    std::shared_ptr<DBConnectionManager> m_db;

    GameInstanceManager(std::shared_ptr<DBConnectionManager> _ptr) : m_db(_ptr) {}

    std::unordered_map<std::string, gameptr> m_game_instances;

    std::string create_game_instance(CreateGameRequest request)
    {
        auto game_instance = std::make_shared<GameInstance>();
        while (m_game_instances.find(game_instance->uuid) != m_game_instances.end())
        {
            game_instance->uuid = generate_uuid();
        }

        auto player = request.player_requests_white ? game_instance->white_player : game_instance->black_player;
        player->client_uuid = request.requestor_client_uuid;

        game_instance->white_player->time_control = request.white_time_control;
        game_instance->black_player->time_control = request.black_time_control;

        m_game_instances[game_instance->uuid] = game_instance;
        return game_instance->uuid;
    }

    gameptr get_game_instance(std::string uuid)
    {
        return m_game_instances[uuid];
    }

    std::vector<std::string> get_legal_moves(std::string uuid)
    {
        auto game_instance = get_game_instance(uuid);
        if (game_instance == nullptr)
        {
            throw std::invalid_argument(
                (boost::format("Couldn't find game instance with uuid: %1%") %
                 uuid)
                    .str());
        }
        return string_list_all_moves(game_instance->position);
    }

    bool make_move(std::string uuid, std::string lan_move, long player_user_id)
    {
        auto game_instance = get_game_instance(uuid);
        if (game_instance == nullptr)
        {
            throw std::invalid_argument(
                (boost::format("Couldn't find game instance with uuid: %1%") %
                 uuid)
                    .str());
        }

        std::shared_ptr<Player> player = game_instance->position->m_whites_turn
                                             ? game_instance->white_player
                                             : game_instance->black_player;
        if (player->user_id != player_user_id)
        {
            throw std::invalid_argument("It is not your turn to move, player " +
                                        std::to_string(player_user_id) + ".");
        }

        MoveKey movekey = lan_to_movekey(lan_move);
        auto moves = get_all_moves(game_instance->position);

        auto it = std::find(moves.begin(), moves.end(), movekey);
        if (it != moves.end())
        {
            game_instance->position->advance_position(movekey);
            return true;
        }
        return false;
    }

    void add_player(std::string client_uuid, std::string game_instance_uuid)
    {
        auto game_instance = get_game_instance(game_instance_uuid);
        if (game_instance == nullptr)
        {
            throw std::invalid_argument(
                (boost::format("Couldn't find game instance with uuid: %1%") %
                 game_instance_uuid)
                    .str());
        }

        if (!game_instance->white_player->client_uuid.empty() &&
            !game_instance->black_player->client_uuid.empty())
        {
            throw std::invalid_argument("Both players are already initialized for game " + game_instance_uuid);
        }

        if (game_instance->white_player->client_uuid.compare(client_uuid) == 0 ||
            game_instance->black_player->client_uuid.compare(client_uuid) == 0)
        {
            throw std::invalid_argument(
                (boost::format("client uuid %1% is already being used on game instance %2%") %
                 client_uuid % game_instance_uuid)
                    .str());
        }

        if (game_instance->white_player->client_uuid.empty()){
            game_instance->white_player->client_uuid = client_uuid;
        }
        else {
            game_instance->black_player->client_uuid = client_uuid;
        }
    }

    // TODO these methods should be class methods on a game instance, and the gameInstanceManager
    // should be a lighter wrapper

    void add_player(long user_id, std::string game_instance_uuid, bool white)
    {
        // auto game_instance = get_game_instance(game_instance_uuid);
        // if (game_instance == nullptr)
        // {
        //     throw std::invalid_argument(
        //         (boost::format("Couldn't find game instance with uuid: %1%") %
        //          game_instance_uuid)
        //             .str());
        // }

        // // if the color player we are about to add is already present on the game
        // if ((white ? game_instance->white_player : game_instance->black_player) != nullptr)
        // {
        //     throw std::invalid_argument(
        //         (boost::format("Game instance with uuid: %1% already has a %2% player.") %
        //          game_instance_uuid % (white ? "white" : "black"))
        //             .str());
        // }

        // std::shared_ptr<Player> player = std::make_shared<Player>();
        // player->time_left_ms = 0;
        // player->user_id = user_id;
        // // player->white = white;
        // (white ? game_instance->white_player : game_instance->black_player) = player;
    }
};