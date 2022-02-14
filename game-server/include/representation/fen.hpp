#pragma once

#include "position.hpp"
#include <regex>
#include <memory>

const std::string few_moves_fen = "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4";
const std::string easy_promote_fen = "rnbq1bnr/pPp2pPp/3k4/8/8/4K3/PpPPPPp1/RNBQ1BNR w - - 0 1";
const std::string easy_mate_fen = "k7/ppp5/8/BBBB1BB1/8/8/4R3/K7 b - - 1 1";

const std::regex fen_regex(
    R"(\s*^(((?:[rnbqkpRNBQKP1-8]+\/){7})[rnbqkpRNBQKP1-8]+)\s([b|w])\s(-|[K|Q|k|q]{1,4})\s(-|[a-h][36])\s(\d+\s\d+)$)");

std::shared_ptr<Position> fen_to_position(std::string fen);
std::string position_to_fen(std::shared_ptr<Position> position);