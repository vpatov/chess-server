#pragma once
#include "models/time_control.hpp"

class Player
{
public:
    bool white;
    std::string client_uuid;
    TimeControl time_control;
};
