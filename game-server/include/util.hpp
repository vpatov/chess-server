#pragma once

#include <regex>
#include <iostream>
#include <filesystem>
#include <string>
#include <mutex>

extern std::mutex STDOUT_MUTEX;

namespace fs = std::filesystem;

const fs::path project_root_dir = (PROJECT_ROOT_DIR); // PROJECT_ROOT_DIR is defined in CMakeLists.txt
const fs::path dev_data_dir = project_root_dir / "dev_data";
const std::string program_start_timestamp = std::to_string(std::chrono::seconds(std::time(NULL)).count());

namespace ColorCode
{
    static const std::string white = "\u001b[37m";
    static const std::string teal = "\u001b[36m";
    static const std::string purple = "\u001b[35m";
    static const std::string blue = "\u001b[34m";
    static const std::string yellow = "\u001b[33m";
    static const std::string green = "\u001b[32m";
    static const std::string red = "\u001b[31m";
    static const std::string end = "\u001b[0m";
};

char getc(int i, std::smatch &matches);

uint64_t current_time_ms();
