#pragma once

#include <boost/format.hpp>
#include "DBConnectionManager.hpp"
#include "models/game_instance.hpp"
#include "models/create_game_request.hpp"
#include "move_generation.hpp"
#include "representation/move.hpp"
#include "uuid.hpp"
#include "representation/fen.hpp"
#include <memory>
#include <stdexcept>
#include <nlohmann/json.hpp>

using json = nlohmann::json;


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

    std::string get_game_state_json(std::string game_instance_uuid) {
        auto game_instance = get_game_instance(game_instance_uuid);
        if (game_instance == nullptr)
        {
            throw std::invalid_argument(
                (boost::format("Couldn't find game instance with uuid: %1%") %
                    game_instance_uuid)
                    .str());
        }

        json game_state = {
            {"fen", position_to_fen(game_instance->position)},
            {"legal_moves", string_list_all_moves(game_instance->position)}
        };
        return game_state.dump();
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

        if (game_instance->white_player->client_uuid.empty()) {
            game_instance->white_player->client_uuid = client_uuid;
        }
        else {
            game_instance->black_player->client_uuid = client_uuid;
        }
    }
};