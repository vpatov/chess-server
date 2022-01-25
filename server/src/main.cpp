#include <chrono>
#include <iostream>
#include <nlohmann/json.hpp>
#include <regex>

#include "httplib.hpp"
#include "move_generation.hpp"
#include "representation/fen.hpp"
#include "representation/position.hpp"
#include "spdlog/sinks/basic_file_sink.h"
#include "spdlog/sinks/stdout_color_sinks.h"
#include "spdlog/spdlog.h"

httplib::Server svr;

using json = nlohmann::json;

const std::regex fen_regex(
    R"(\s*^(((?:[rnbqkpRNBQKP1-8]+\/){7})[rnbqkpRNBQKP1-8]+)\s([b|w])\s(-|[K|Q|k|q]{1,4})\s(-|[a-h][36])\s(\d+\s\d+)$)");

spdlog::logger create_logger()
{
  auto console_sink = std::make_shared<spdlog::sinks::stdout_color_sink_mt>();
  console_sink->set_level(spdlog::level::trace);
  console_sink->set_pattern("[%^%l%$] %v");

  auto file_sink = std::make_shared<spdlog::sinks::basic_file_sink_mt>(
      "/Users/vas/log/chess-server-log.txt", true);
  file_sink->set_level(spdlog::level::trace);

  auto logger = spdlog::logger("multi_sink", {console_sink, file_sink});

  logger.set_level(spdlog::level::trace);
  logger.flush_on(spdlog::level::trace);
  logger.debug("START ----- " + program_start_timestamp);

  return logger;
}

int main()
{
  json status = {{"name", "chess_server"}, {"status", "healthy"}};
  spdlog::logger logger = create_logger();

  svr.set_post_routing_handler(
      [](const httplib::Request &req, httplib::Response &res)
      {
        res.set_header("Access-Control-Allow-Origin", "*");
      });

  svr.set_logger([&logger](const auto &req, const auto &res)
                 {
    std::string req_dump = "==============\nREQUEST\nbody: " + req.body + '\n';
    req_dump += "headers: \n";
    for (auto it = req.headers.begin(); it != req.headers.end(); it++) {
      req_dump += it->first + ": " + it->second + "\n";
    }

    std::string res_dump = "==============\nRESPONSE\nbody: " + res.body + '\n';
    res_dump += "headers: \n";
    for (auto it = res.headers.begin(); it != res.headers.end(); it++) {
      res_dump += it->first + ": " + it->second + "\n";
    }
    logger.debug("Logging request:\n {}", req_dump);
    logger.debug("Logging response:\n {}", res_dump); });

  svr.set_exception_handler([](const auto &req, auto &res, std::exception &e)
                            {
    res.status = 500;
    auto fmt = "<h1>Error 500! Nobody's perfect eh...</h1><p>%s</p>";
    char buf[BUFSIZ];
    snprintf(buf, sizeof(buf), fmt, e.what());
    res.set_content(buf, "text/html"); });

  svr.Options(R"(/(.*))", [&status](const httplib::Request &req,
                                    httplib::Response &res)
              {
    res.set_header("Access-Control-Allow-Headers", "*");
    res.set_header("Access-Control-Allow-Methods", "OPTIONS,POST,GET");
    res.set_header("Content-Type", "application/json"); });

  svr.Get("/", [&status](const httplib::Request &req, httplib::Response &res)
          { res.set_content(status.dump(), "application/json"); });

  svr.Post("/legal_moves",
           [&status](const httplib::Request &req, httplib::Response &res)
           {
             json body = json::parse(req.body);
             if (!body.contains("fen"))
             {
               res.status = 400;
               res.set_content(
                   "The request must have a fen string as a value for \"fen\".",
                   "text/plain");
               return;
             }

             std::string fen_string = body["fen"].get<std::string>();

             std::smatch matches;
             if (!std::regex_match(fen_string, matches, fen_regex))
             {
               res.status = 400;
               res.set_content("Invalid fen string.", "text/plain");
               return;
             }

             json moves = string_list_all_moves(fen_to_position(fen_string));
             res.set_content(moves.dump(), "application/json");
           });

  svr.listen("0.0.0.0", 8080);
}