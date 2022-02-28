#pragma once

#include <string>
#include "GameInstanceManager.hpp"
#include "TimerDispatch.hpp"
#include "models/api.hpp"
#include "models/client_connection_info.hpp"
#include "util.hpp"

class EventProcessor {
public:
    std::shared_ptr<GameInstanceManager> m_game_instance_manager;
    std::shared_ptr<TimerDispatch> m_timer_dispatch;
    std::function<void(std::string)> websocket_timer_callback;

    EventProcessor(std::shared_ptr<GameInstanceManager> game_instance_manager, std::shared_ptr<TimerDispatch> timer_dispatch)
        : m_game_instance_manager(game_instance_manager), m_timer_dispatch(timer_dispatch) {

        m_timer_dispatch->start_game_instance_cleanup_loop([this]() {
            m_game_instance_manager->cleanup_expired_game_instances();
        });

    }


    void set_websocket_timer_callback(std::function<void(std::string)> fn) {
        websocket_timer_callback = fn;
    }

    // TODO need to use a lock here so that websocket event and timer event 
    // isnt processing the game at the same time
    void process_timer_event(std::string game_instance_uuid) {
        auto game_instance = m_game_instance_manager->get_game_instance(game_instance_uuid);

        // if we are here that means that whosever turn it is has run out of time
        game_instance->win_by_timeout(game_instance->get_player_waiting_for_their_turn());
    }

    void process_message(ClientConnectionInfo ccinfo, ClientWsMessage message) {
        // assuming message is legal, execute action

        auto game_instance = m_game_instance_manager->get_game_instance(ccinfo.game_instance_uuid);
        auto acting_player = game_instance->get_player(ccinfo.client_uuid);

        switch (message.type) {
        case START_GAME: {
        
                game_instance->start_game();
                // m_timer_dispatch->start_game_instance_timeout_timer(
                //     game_instance->uuid,
                //     game_instance->white_player->time_control.time_left_ms,
                //     [this, game_instance]() {
                //     game_instance->win_by_timeout(game_instance->black_player);
                //     websocket_timer_callback(game_instance->uuid);
                // });
                break;
            }
        case MAKE_MOVE: {
                std::string lan_move = message.payload;
                game_instance->make_move(lan_move);
                bool game_over = game_instance->check_apply_game_over_condition();
                if (!game_over) {

                    auto player_just_acted = game_instance->get_player_waiting_for_their_turn();
                    auto player_starting_turn = game_instance->get_player_to_act();

                    // decrement the time of the player who just went.
                    auto time_now = current_time_ms();
                    auto other_player_last_move = player_starting_turn->time_control.last_move_played;
                    uint64_t difference = time_now - other_player_last_move;

                    if (difference > player_just_acted->time_control.time_left_ms) {
                        std::cout << ColorCode::red << "difference was greater than time left." << ColorCode::end << std::endl;
                        player_just_acted->time_control.time_left_ms = 0;
                    }
                    else {
                        player_just_acted->time_control.time_left_ms -= difference;
                        player_just_acted->time_control.time_left_ms += player_just_acted->time_control.increment_ms;
                    }

                    // start timer for the player whose turn it is.
                    m_timer_dispatch->start_game_instance_timeout_timer(
                        game_instance->uuid,
                        player_starting_turn->time_control.time_left_ms,
                        [this, game_instance, player_just_acted]() {
                        std::cout << ColorCode::purple << "EventProcessor::make_move_start_game_instance_timeout_timer "
                            << game_instance->uuid << ColorCode::end << std::endl;

                        game_instance->win_by_timeout(player_just_acted);
                        websocket_timer_callback(game_instance->uuid);
                    });
                }
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


        if (game_instance->is_game_finished()) {
            m_timer_dispatch->cancel_timer(game_instance->uuid);
        }
    }



};