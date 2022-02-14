#pragma once

#include "DBConnectionManager.hpp"
#include "logger/logger.hpp"
#include "models/api.hpp"
#include "models/game_instance.hpp"
#include "move_generation.hpp"
#include "representation/fen.hpp"
#include "representation/move.hpp"
#include "uuid.hpp"
#include <boost/format.hpp>
#include <memory>
#include <nlohmann/json.hpp>
#include <stdexcept>
#include <websocketpp/connection.hpp>
#include <set>

using json = nlohmann::json;
using websocketpp::connection_hdl;

using gameptr = std::shared_ptr<GameInstance>;
class GameInstanceManager {
public:
    std::shared_ptr<DBConnectionManager> m_db;
    std::shared_ptr<spdlog::logger> m_logger;

    GameInstanceManager(std::shared_ptr<DBConnectionManager> _ptr) : m_db(_ptr) {
        m_logger = spdlog::get("multi_sink");
    }

    std::unordered_map<std::string, gameptr> m_game_instances;

    std::string create_game_instance(CreateGameRequest request) {
        auto game_instance = std::make_shared<GameInstance>();

        while (m_game_instances.find(game_instance->uuid) !=
               m_game_instances.end()) {
            game_instance->uuid = generate_uuid();
        }

        auto player = request.player_requests_white ? game_instance->white_player
            : game_instance->black_player;
        player->client_uuid = request.requestor_client_uuid;

        game_instance->white_player->time_control = request.white_time_control;
        game_instance->black_player->time_control = request.black_time_control;

        m_game_instances[game_instance->uuid] = game_instance;
        return game_instance->uuid;
    }


    gameptr get_game_instance(std::string uuid, bool throw_if_not_found) {
        auto game_instance = m_game_instances[uuid];
        if (throw_if_not_found && game_instance == nullptr) {
            throw std::invalid_argument(
                (boost::format("Couldn't find game instance with uuid: %1%") % uuid)
                    .str());
        }
        return game_instance;
    }

    gameptr get_game_instance(std::string uuid) { return get_game_instance(uuid, true); }

    std::vector<std::string> get_legal_moves(std::string uuid) {
        auto game_instance = get_game_instance(uuid);
        return string_list_all_moves(game_instance->position);
    }

    json get_game_state_json(std::string game_instance_uuid) {
        auto game_instance = get_game_instance(game_instance_uuid);
        return game_instance->get_json();
    }

    void resign(std::string game_instance_uuid, std::string resigner_client_uuid) {
        auto game_instance = get_game_instance(game_instance_uuid);
        auto player = game_instance->get_player(resigner_client_uuid);

        std::string message = (boost::format("Game over, %1% resigns.") % (player->white ? "white" : "black"))
            .str();

        game_instance->end_game();

        // TODO send message, and reason for game being over.
        // TODO implement end_game function
    }

    void offer_draw(std::string game_instance_uuid, std::string initiator_client_uuid){
        // TODO implement
    }

    void accept_draw_offer(std::string game_instance_uuid, std::string acceptor_client_uuid){
        // TODO implement
    }

    /*
    TODO
        - implement validation layer
        - create logical separation between GameInstanceManager and GameInstance. GameInstanceManager
            should be concerned with the aspect of managing multiple game states, creating and cleaning them up.
            The GameInstance class should be concerned with mutating game state, i.e. making moves and what not.
            You need a separate logical distinction for enforcing gameplay logic, like throwing exceptions if illegal
            actions are performed, or returning messages to the user.
        - create clean hierarchy of incoming messages and outgoing messages.
    */


    bool start_game(std::string game_instance_uuid) {
        auto game_instance = get_game_instance(game_instance_uuid);
        return game_instance->start_game();
    }

    bool make_move(std::string game_instance_uuid, std::string lan_move,
                   std::string client_uuid) {
        auto game_instance = get_game_instance(game_instance_uuid);

        if (game_instance->state != GameInstanceState::IN_PLAY) {
            throw std::invalid_argument("Game instance " + game_instance_uuid + " has finished.");
        }

        auto player = game_instance->get_player_to_act();
        if (player->client_uuid.compare(client_uuid) != 0) {
            throw std::invalid_argument("It is not your turn to move, player " +
                                        client_uuid + ".");
        }

        return game_instance->make_move(lan_move);
    }

    void add_connection_handle(std::string game_instance_uuid, connection_hdl hdl){
        auto game_instance = get_game_instance(game_instance_uuid);
        game_instance->add_connection(hdl);
    }

    void remove_connection_handle(std::string game_instance_uuid, connection_hdl hdl){
        auto game_instance = get_game_instance(game_instance_uuid);
        game_instance->remove_connection(hdl);
    }


    auto get_connections(std::string game_instance_uuid){
        auto game_instance = get_game_instance(game_instance_uuid);
        return &(game_instance->connections);
    }

    std::shared_ptr<Player> get_player(std::string client_uuid, std::string game_instance_uuid){
        auto game_instance = get_game_instance(game_instance_uuid);
        return game_instance->get_player(client_uuid);
    }

    // TODO create_game_instance should call this method, and this method should accept the player color as a parameter.
    void add_player(std::string client_uuid, std::string game_instance_uuid) {
        auto game_instance = get_game_instance(game_instance_uuid);

        if (game_instance->is_game_full()) {
            m_logger->debug("Both players are already initialized for game {}", game_instance_uuid);
            return;
        }

        if (game_instance->get_player(client_uuid) != nullptr) {
            m_logger->debug(
                "client uuid {} is already being used on game instance {}",
                client_uuid, game_instance_uuid);
            return;
        }

        if (game_instance->white_player->client_uuid.empty()) {
            game_instance->white_player->client_uuid = client_uuid;
        }
        else {
            game_instance->black_player->client_uuid = client_uuid;
        }
    }
};