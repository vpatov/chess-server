#pragma once

#include "position.hpp"
#include <regex>
#include <memory>

const std::regex fen_regex(
    R"(\s*^(((?:[rnbqkpRNBQKP1-8]+\/){7})[rnbqkpRNBQKP1-8]+)\s([b|w])\s(-|[K|Q|k|q]{1,4})\s(-|[a-h][36])\s(\d+\s\d+)$)");

std::shared_ptr<Position> fen_to_position(std::string fen);
std::string position_to_fen(std::shared_ptr<Position> position);