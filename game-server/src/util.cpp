#include "util.hpp"
#include <sys/time.h>
#include <chrono>
#include <ctime>

std::mutex STDOUT_MUTEX;


uint64_t current_time_ms(){
    return std::chrono::duration_cast<std::chrono::milliseconds>(
            std::chrono::system_clock::now().time_since_epoch()).count();
}