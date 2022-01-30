#include <chrono>
#include <iostream>
#include <nlohmann/json.hpp>
#include <regex>

#include "models/create_game_request.hpp"
#include "move_generation.hpp"
#include "representation/fen.hpp"
#include "representation/position.hpp"
#include "server.hpp"
#include "spdlog/sinks/basic_file_sink.h"
#include "spdlog/sinks/stdout_color_sinks.h"
#include "spdlog/spdlog.h"
#include <sstream>

using json = nlohmann::json;

const char *JSON_CONTENT_TYPE = "application/json";

std::shared_ptr<spdlog::logger> create_logger() {
  auto console_sink = std::make_shared<spdlog::sinks::stdout_color_sink_mt>();
  console_sink->set_level(spdlog::level::trace);
  console_sink->set_pattern("[%^%l%$] %v");

  auto file_sink = std::make_shared<spdlog::sinks::basic_file_sink_mt>(
      "./logs/chess-server-log.txt", true);
  file_sink->set_level(spdlog::level::trace);

  auto logger = std::make_shared<spdlog::logger>(
      spdlog::logger("multi_sink", {console_sink, file_sink}));

  logger->set_level(spdlog::level::trace);
  logger->flush_on(spdlog::level::trace);
  logger->debug("START ----- " + program_start_timestamp);

  return logger;
}

void ChessServer::start() {
  std::cout << "Listening on port 8080..." << std::endl;
  m_svr->listen("0.0.0.0", 8080);
}

void ChessServer::init() {
  init_logger();
  init_middleware();
  init_routes();
}

void ChessServer::init_logger() {
  auto logger = create_logger();
  m_svr->set_logger([logger](const auto &req, const auto &res) {
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
    logger->debug("Logging request:\n {}", req_dump);
    logger->debug("Logging response:\n {}", res_dump);
  });
}

void ChessServer::init_middleware() {
  m_svr->set_post_routing_handler(
      [](const httplib::Request &req, httplib::Response &res) {
        res.set_header("Access-Control-Allow-Origin", "*");
      });

  m_svr->set_exception_handler(
      [](const auto &req, auto &res, std::exception &e) {
        res.status = 500;
        auto fmt = "<h1>Error 500! Nobody's perfect eh...</h1><p>%s</p>";
        char buf[BUFSIZ];
        snprintf(buf, sizeof(buf), fmt, e.what());
        res.set_content(buf, "text/html");
      });
}

void ChessServer::init_routes() {

  m_svr->Options(
      R"(/(.*))", [](const httplib::Request &req, httplib::Response &res) {
        res.set_header("Access-Control-Allow-Headers", "*");
        res.set_header("Access-Control-Allow-Methods", "OPTIONS,POST,GET");
        res.set_header("Content-Type", JSON_CONTENT_TYPE);
      });

  m_svr->Get("/", [](const httplib::Request &req, httplib::Response &res) {
    // json body = json::parse(req.body);
    json status = {{"name", "chess_server"}, {"status", "healthy"}};
    res.set_content(status.dump(), JSON_CONTENT_TYPE);
  });

  m_svr->Post("/create_game", [this](const httplib::Request &req,
                                     httplib::Response &res) {
    json body = json::parse(req.body);
    CreateGameRequest request;

    request.white_time_control.time_left_ms =
        body["white_time_control"]["time_left_ms"].get<uint64_t>();
    request.white_time_control.increment_ms =
        body["white_time_control"]["increment_ms"].get<uint64_t>();
    request.black_time_control.time_left_ms =
        body["black_time_control"]["time_left_ms"].get<uint64_t>();
    request.black_time_control.increment_ms =
        body["black_time_control"]["increment_ms"].get<uint64_t>();
    request.use_matchmaking_pool = body["use_matchmaking_pool"].get<bool>();
    request.player_requests_white = body["player_requests_white"].get<bool>();
    request.requestor_client_uuid =
        body["requestor_client_uuid"].get<std::string>();

    std::string uuid = m_game_instance_manager->create_game_instance(request);
    json response = {{"game_instance_uuid", uuid}};
    res.set_content(response.dump(), JSON_CONTENT_TYPE);
  });

  m_svr->Post("/join_game", [this](const httplib::Request &req,
                                   httplib::Response &res) {
    json body = json::parse(req.body);

    m_game_instance_manager->add_player(
        body["client_uuid"].get<std::string>(),
        body["game_instance_uuid"].get<std::string>());

    res.set_content((json{{"status", "ok"}}).dump(), JSON_CONTENT_TYPE);
  });

  // TODO model interaction between BE and FE and design rest of APIs around
  // that

  m_svr->Post(
      "/legal_moves", [](const httplib::Request &req, httplib::Response &res) {
        json body = json::parse(req.body);
        if (!body.contains("fen")) {
          res.status = 400;
          res.set_content(
              "The request must have a fen string as a value for \"fen\".",
              "text/plain");
          return;
        }

        std::string fen_string = body["fen"].get<std::string>();

        std::smatch matches;
        if (!std::regex_match(fen_string, matches, fen_regex)) {
          res.status = 400;
          res.set_content("Invalid fen string.", "text/plain");
          return;
        }

        json moves = string_list_all_moves(fen_to_position(fen_string));
        res.set_content(moves.dump(), JSON_CONTENT_TYPE);
      });

  m_svr->Post("/signup", [this](const httplib::Request &req,
                                httplib::Response &res) {
    json body = json::parse(req.body);

    if (!body.contains("username") || !body.contains("password")) {
      res.status = 400;
      res.set_content("Invalid request.", "text/plain");
      return;
    }

    json response = m_user_manager->signup(body["username"].get<std::string>(),
                                           body["password"].get<std::string>());
    res.set_content(response.dump(), JSON_CONTENT_TYPE);
  });

  m_svr->Post("/login",
              [this](const httplib::Request &req, httplib::Response &res) {
                json body = json::parse(req.body);

                if (!body.contains("username") || !body.contains("password")) {
                  res.status = 400;
                  res.set_content("Invalid request.", "text/plain");
                  return;
                }

                bool valid_credentials = m_user_manager->validate_credentials(
                    body["username"].get<std::string>(),
                    body["password"].get<std::string>());

                if (!valid_credentials) {
                  json response = {{"error", "Invalid login credentials."}};
                  res.set_content(response.dump(), JSON_CONTENT_TYPE);
                  return;
                }
                json response = {{"status", "ok"}};
                res.set_content(response.dump(), JSON_CONTENT_TYPE);
              });
}
