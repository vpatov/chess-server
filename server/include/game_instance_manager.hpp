#pragma once

#include "game_instance.hpp"
#include <unordered_map>
#include <string>
#include <memory>

std::unordered_map<std::string, std::shared_ptr<GameInstance>> game_instances;

void create_game_instance();