
#pragma once

#include "representation/move.hpp"
#include "representation/position.hpp"
#include "representation/fen.hpp"
#include "move_generation.hpp"
#include <nlohmann/json.hpp>
#include "models/player.hpp"
#include "uuid.hpp"
#include "util.hpp"
#include <string>
#include <set>
#include <vector>
#include <websocketpp/connection.hpp>


using json = nlohmann::json;
using websocketpp::connection_hdl;

enum GameInstanceState {
    NOT_STARTED,
    IN_PLAY,
    FINISHED
};

const std::string gameResultConditionString[] = {
    "TIMEOUT",
    "CHECKMATE",
    "RESIGNATION",
    "DRAW",
    "STALEMATE"
};

enum GameResultCondition {
    TIMEOUT,
    CHECKMATE,
    RESIGNATION,
    DRAW,
    STALEMATE
};

struct GameInstanceResult {
    GameResultCondition game_result_condition;
    std::shared_ptr<Player> victor;

    GameInstanceResult(GameResultCondition game_result_condition, std::shared_ptr<Player> victor)
        : game_result_condition(game_result_condition), victor(victor) {}
};

class GameInstance
{
public:
    std::string uuid;
    std::shared_ptr<Position> position;
    GameInstanceState state;

    std::vector<std::string> moves_played;

    std::shared_ptr<Player> white_player;
    std::shared_ptr<Player> black_player;

    std::time_t game_started;

    std::shared_ptr<GameInstanceResult> result;

    std::shared_ptr<Player> player_offered_draw = nullptr;

    std::set<connection_hdl, std::owner_less<connection_hdl>> connections;

    GameInstance()
    {
        uuid = generate_uuid();
        position = starting_position();
        white_player = std::make_shared<Player>();
        white_player->white = true;
        black_player = std::make_shared<Player>();
        black_player->white = false;
        state = GameInstanceState::NOT_STARTED;
    }

    std::shared_ptr<Player> get_player_to_act() {
        return position->m_whites_turn
            ? white_player
            : black_player;
    }

    std::shared_ptr<Player> get_player_waiting_for_their_turn() {
        return position->m_whites_turn
            ? black_player
            : white_player;
    }

    std::shared_ptr<Player> get_player(std::string client_uuid) {
        if (white_player->client_uuid.compare(client_uuid) == 0) {
            return white_player;
        }
        else if (black_player->client_uuid.compare(client_uuid) == 0) {
            return black_player;
        }
        return nullptr;
    }

    GameInstanceState get_game_state() {
        return state;
    }

    bool is_game_finished() {
        return state == GameInstanceState::FINISHED;
    }

    bool start_game() {
        state = GameInstanceState::IN_PLAY;
        game_started = current_time_ms();
        white_player->time_control.last_move_played = game_started;
        black_player->time_control.last_move_played = game_started;
        return true;
    }

    void end_game() {
        state = GameInstanceState::FINISHED;
        if (result == nullptr) {
            throw std::invalid_argument("Result needs to be instantiated before game is ended.");
        }
        // TODO
        // destroy timers
        // eventually expire this game instance
    }

    bool check_apply_game_over_condition() {
        bool king_is_in_check = position->is_king_in_check(position->m_whites_turn);
        auto moves = get_all_moves(position);

        if (moves.size() > 0) {
            return false;
        }

        if (king_is_in_check) {
            win_by_checkmate(position->m_whites_turn ? black_player : white_player);
        }
        else {
            draw_by_stalemate();
        }
        return true;
    }

    bool make_move(std::string lan_move) {
        MoveKey movekey = lan_to_movekey(lan_move);
        auto moves = get_all_moves(position);

        auto it = std::find(moves.begin(), moves.end(), movekey);
        if (it == moves.end()) {
            return false;
        }

        // TODO also get short algebraic notation of move
        position->advance_position(movekey);
        moves_played.push_back(lan_move);
        // update the last_move_played time for the player who just went
        get_player_waiting_for_their_turn()->time_control.last_move_played = current_time_ms();
        return true;

    }

    bool is_game_full() {
        return !white_player->client_uuid.empty() && !black_player->client_uuid.empty();
    }

    void remove_connection(connection_hdl hdl) {
        connections.erase(hdl);
    }

    void add_connection(connection_hdl hdl) {
        connections.insert(hdl);
    }

    void offer_draw(std::shared_ptr<Player> offerer) {
        player_offered_draw = offerer;
    }

    void decline_or_rescind_draw_offer() {
        player_offered_draw = nullptr;
    }

    void accept_draw_offer() {
        result = std::make_shared<GameInstanceResult>(
            GameInstanceResult(GameResultCondition::DRAW, nullptr));
        end_game();
    }

    void draw_by_stalemate() {
        result = std::make_shared<GameInstanceResult>(
            GameInstanceResult(GameResultCondition::STALEMATE, nullptr));
        end_game();
    }

    void win_by_checkmate(std::shared_ptr<Player> winner) {
        result = std::make_shared<GameInstanceResult>(
            GameInstanceResult(GameResultCondition::CHECKMATE, winner));
        end_game();
    }

    void win_by_timeout(std::shared_ptr<Player> winner) {
        result = std::make_shared<GameInstanceResult>(
            GameInstanceResult(GameResultCondition::TIMEOUT, winner));
        end_game();
    }

    void win_by_resignation(std::shared_ptr<Player> winner) {
        result = std::make_shared<GameInstanceResult>(
            GameInstanceResult(GameResultCondition::RESIGNATION, winner));
        end_game();
    }

    json get_result_json() {
        json result_json = {
            {"condition", gameResultConditionString[result->game_result_condition]}
        };
        if (result->victor != nullptr) {
            result_json["winner"] = result->victor->white ? "white" : "black";
        }
        return result_json;
    }

    json get_time_control_json(){
        json time_control_json = {
            {"white", white_player->time_control.time_left_ms},
            {"black", black_player->time_control.time_left_ms}
        };
        return time_control_json;
    }

    json get_json() {
        bool king_is_in_check = position->is_king_in_check(position->m_whites_turn);
        square_t king_square = position->find_king(position->m_whites_turn);
        json game_state = {
            {"fen", position_to_fen(position)},
            {"moves_played", moves_played},
            {"currentTurnClientUUID",
            position->m_whites_turn
                ? white_player->client_uuid
                : black_player->client_uuid},
            {"time_control", get_time_control_json()},
            {"game_instance_state", state}
        };

        // add the result if it exists
        if (result != nullptr) {
            game_state["result"] = get_result_json();
        }
        // only calculate legal moves if the game is not over
        else {
            game_state["legal_moves"] = string_list_all_moves(position);
        }

        if (king_is_in_check) {
            game_state["king_in_check_square"] = index_to_an_square(king_square);
        }
        return game_state;
    }
};