#pragma once

struct TimeControl {
    uint64_t time_left_ms;
    uint64_t increment_ms;
    uint64_t last_move_played;
};