#include "logger/logger.hpp"

void initialize_logger()
{
    auto console_sink = std::make_shared<spdlog::sinks::stdout_color_sink_mt>();
    console_sink->set_level(spdlog::level::trace);

    auto file_sink = std::make_shared<spdlog::sinks::basic_file_sink_mt>(
        "./logs/chess-server-log.txt", true);
    file_sink->set_level(spdlog::level::trace);

    auto logger = std::make_shared<spdlog::logger>(
        spdlog::logger("multi_sink", {console_sink, file_sink}));

    spdlog::set_pattern("%+ %v");

    logger->set_level(spdlog::level::trace);
    logger->flush_on(spdlog::level::trace);
    logger->info("Logger initialized.");

    spdlog::register_logger(logger);
}
