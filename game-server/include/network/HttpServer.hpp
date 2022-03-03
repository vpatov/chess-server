#pragma once

#include "external/httplib/httplib.hpp"
#include "logger/logger.hpp"
#include "managers/GameInstanceManager.hpp"
#include "managers/UserManager.hpp"
#include "models/api.hpp"
#include "util.hpp"

const char *const JSON_CONTENT_TYPE = "application/json";

class HttpServer {
private:
  httplib::Server m_server;
  std::shared_ptr<GameInstanceManager> m_game_instance_manager;
  std::shared_ptr<UserManager> m_user_manager;

public:
  HttpServer(std::shared_ptr<GameInstanceManager> game_instance_manager,
             std::shared_ptr<UserManager> user_manager)
      : m_game_instance_manager(game_instance_manager),
        m_user_manager(user_manager) {}

  void init_logger();

  void init_middleware();

  void init_routes();

  std::thread run(int port) {
    auto t = std::thread([this, port] {
      {
        std::unique_lock<std::mutex> lock(STDOUT_MUTEX);
        std::cout << "HTTP Server listening on port " << port << std::endl;
      }
      m_server.listen("0.0.0.0", port);
    });
    return t;
  }
};

