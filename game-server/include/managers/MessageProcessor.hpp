#pragma once

#include <string>
#include "GameInstanceManager.hpp"
#include "models/api.hpp"
#include "models/client_connection_info.hpp"

class MessageProcessor {
public:
    std::shared_ptr<GameInstanceManager> m_game_instance_manager;

    MessageProcessor(std::shared_ptr<GameInstanceManager> game_instance_manager)
        : m_game_instance_manager(game_instance_manager) {}


    void process_message(ClientConnectionInfo ccinfo, ClientWsMessage message) {
        // assuming message is legal, execute action

        auto game_instance = m_game_instance_manager->get_game_instance(ccinfo.game_instance_uuid);
        auto acting_player = game_instance->get_player(ccinfo.client_uuid);

        switch (message.type) {
        case START_GAME: {
                game_instance->start_game();
                break;
            }
        case MAKE_MOVE: {
                std::string lan_move = message.payload;
                game_instance->make_move(lan_move);
                break;
            }
        case RESIGN: {
                auto other_player = (game_instance->white_player == acting_player)
                    ? game_instance->black_player :
                    game_instance->white_player;
                game_instance->win_by_resignation(other_player);
                break;
            }
        case OFFER_DRAW: {
                game_instance->offer_draw(acting_player);
                break;
            }
        case ACCEPT_DRAW_OFFER: {
                game_instance->accept_draw_offer();
                break;
            }
        case TAKE_BACK_DRAW_OFFER: {
                game_instance->decline_or_rescind_draw_offer();
                break;
            }
        case DECLINE_DRAW_OFFER: {
                game_instance->decline_or_rescind_draw_offer();
                break;
            }
        default: {
                throw std::invalid_argument("Unrecognized ActionType " + message.type);
            }

        }
    }



};