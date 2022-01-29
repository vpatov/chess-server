#pragma once
#include "models/time_control.hpp"

class Player
{
public:
    long user_id;
    std::string client_uuid;
    TimeControl time_control;
};
