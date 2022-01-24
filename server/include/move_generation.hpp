#pragma once

#include "representation/position.hpp"
#include "representation/move.hpp"
#include <cstdint>
#include <vector>

bool white_attacks_diagonally(piece_t piece);
bool black_attacks_diagonally(piece_t piece);
bool white_attacks_files_ranks(piece_t piece);
bool black_attacks_files_ranks(piece_t piece);

bool is_w_pawn(piece_t piece);
bool is_b_pawn(piece_t piece);
bool is_w_bishop(piece_t piece);
bool is_w_rook(piece_t piece);
bool is_w_queen(piece_t piece);
bool is_b_bishop(piece_t piece);
bool is_b_rook(piece_t piece);
bool is_b_queen(piece_t piece);

template <Color C>
std::vector<MoveKey>
generate_pseudolegal_pawn_moves(std::shared_ptr<Position> position,
                                square_t square);

template <Color C>
std::vector<MoveKey>
generate_pseudolegal_king_moves(std::shared_ptr<Position> position,
                                square_t square);

template <Color C>
std::vector<MoveKey>
generate_pseudolegal_castling_king_moves(std::shared_ptr<Position> position,
                                         square_t square);

template <Color C>
std::vector<MoveKey>
generate_pseudolegal_knight_moves(std::shared_ptr<Position> position,
                                  square_t square);

template <Color C>
std::vector<MoveKey>
generate_pseudolegal_rook_moves(std::shared_ptr<Position> position,
                                square_t square);

template <Color C>
std::vector<MoveKey>
generate_pseudolegal_bishop_moves(std::shared_ptr<Position> position,
                                  square_t square);

template <Color C>
std::vector<MoveKey>
generate_pseudolegal_queen_moves(std::shared_ptr<Position> position,
                                 square_t square);

template <Color C>
std::vector<MoveKey>
generate_pseudolegal_piece_moves(std::shared_ptr<Position> position,
                                 square_t square);

std::vector<MoveKey>
generate_pseudolegal_piece_moves(std::shared_ptr<Position> position,
                                 square_t square);

std::vector<MoveKey>
generate_legal_moves(std::shared_ptr<Position> position,
                     square_t square);

std::vector<MoveKey> get_all_moves(std::shared_ptr<Position> position);
std::string get_all_moves_as_string(std::shared_ptr<Position> position);
std::vector<std::string> string_list_all_moves(std::shared_ptr<Position> position);

Move unpack_move_key(MoveKey move_key);
MoveKey generate_move_key(square_t src_square, square_t dest_square, piece_t promotion_piece);