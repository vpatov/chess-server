#pragma once

#include "logger/logger.hpp"
#include "util.hpp"
#include "models/api.hpp"
#include "models/game_instance.hpp"
#include "GameInstanceManager.hpp"
#include "move_generation.hpp"
#include "representation/fen.hpp"
#include "representation/move.hpp"
#include "uuid.hpp"
#include <boost/format.hpp>
#include <memory>
#include <nlohmann/json.hpp>
#include <stdexcept>

using json = nlohmann::json;

class ValidationService {

public:
    std::shared_ptr<GameInstanceManager> m_game_instance_manager;

    ValidationService(std::shared_ptr<GameInstanceManager> game_instance_manager)
        : m_game_instance_manager(game_instance_manager) {}

    void validate_ws_action(ClientConnectionInfo ccinfo, ClientWsMessage ws_action) {

        auto game_instance = m_game_instance_manager->get_game_instance(ccinfo.game_instance_uuid);
        auto state = game_instance->get_game_state();
        auto player = game_instance->get_player(ccinfo.client_uuid);
        auto whites_turn = game_instance->position->m_whites_turn;

        if (player == nullptr) {
            throw std::invalid_argument(
                           (boost::format("Player with client_uuid: %1% doesn't exist on game instance: ") %
                               ccinfo.client_uuid % ccinfo.game_instance_uuid)
                               .str());
        }

        switch (ws_action.type) {

        case START_GAME: {
                std::cout << "Validating START_GAME" << std::endl;
                // ensure game has not been started yet
                if (state != GameInstanceState::NOT_STARTED) {
                    throw std::invalid_argument("Can only start a game that has not started yet.");
                }
                if (!player->white) {
                    throw std::invalid_argument("Only white can start the game.");
                }
                break;
            }
        case MAKE_MOVE: {
                std::cout << "Validating MAKE_MOVE" << std::endl;

                // ensure game is in play
                if (state != GameInstanceState::IN_PLAY) {
                    throw std::invalid_argument("Can only make moves while the game is in play.");
                }

                // ensure correct player is sending action
                auto player_to_act = whites_turn ? game_instance->white_player : game_instance->black_player;
                if (player_to_act != player) {
                    throw std::invalid_argument(std::string() + "It is not " + (whites_turn ? "black" : "white") + "'s turn to move.");
                }

                // ensure move is legal
                std::string lan_move = ws_action.payload;
                MoveKey movekey = lan_to_movekey(lan_move);
                auto moves = get_all_moves(game_instance->position);

                // debugging code
                std::cout << ColorCode::purple << "movekey: " << movekey
                    << ", lanmove: " << lan_move << ColorCode::end << std::endl;
                std::cout << ColorCode::green << "printout of all lan moves" << std::endl;
                for (auto it = moves.begin(); it != moves.end(); it++) {
                    std::cout << *it << ": " << movekey_to_lan(*it) << " ";
                }
                std::cout << ColorCode::end << std::endl;
                // end debugging code

                auto it = std::find(moves.begin(), moves.end(), movekey);
                if (it == moves.end()) {
                    throw std::invalid_argument(std::string() + "ValidationService: Move " + lan_move + " is not a legal move.");
                }

                break;
            }
        case RESIGN: {
                std::cout << "Validating RESIGN" << std::endl;

                // ensure game is in play
                if (game_instance->get_game_state() != GameInstanceState::IN_PLAY) {
                    throw std::invalid_argument("Can only resign while the game is in play.");
                }
                break;
            }
        case OFFER_DRAW: {
                std::cout << "Validating OFFER_DRAW" << std::endl;

                // ensure game is in play
                if (game_instance->get_game_state() != GameInstanceState::IN_PLAY) {
                    throw std::invalid_argument("Can only offer a draw while the game is in play.");
                }
                break;
            }
        case ACCEPT_DRAW_OFFER: {
                std::cout << "Validating ACCEPT_DRAW_OFFER" << std::endl;

                // ensure game is in play
                if (game_instance->get_game_state() != GameInstanceState::IN_PLAY) {
                    throw std::invalid_argument("Can only accept a draw while the game is in play.");
                }

                if (game_instance->player_offered_draw == nullptr) {
                    throw std::invalid_argument("There is no draw offer to accept.");
                }
                break;
            }
        case TAKE_BACK_DRAW_OFFER: {
                if (game_instance->get_game_state() != GameInstanceState::IN_PLAY) {
                    throw std::invalid_argument("Can only take back a draw offer while the game is in play.");
                }
                if (game_instance->player_offered_draw == nullptr) {
                    throw std::invalid_argument("There is no draw offer to take back.");
                }
                break;
            }

        case DECLINE_DRAW_OFFER: {
                if (game_instance->get_game_state() != GameInstanceState::IN_PLAY) {
                    throw std::invalid_argument("Can only decline a draw offer while the game is in play.");
                }
                if (game_instance->player_offered_draw == nullptr) {
                    throw std::invalid_argument("There is no draw offer to decline.");
                }
                break;
            }

        default: {
                throw std::invalid_argument("Unrecognized ActionType " + ws_action.type);
            }
        }


    }



};