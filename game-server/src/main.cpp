
#include "server.hpp"
#include "game_instance.hpp"
#include "game_instance_manager.hpp"
#include "uuid.hpp"
#include "ws.hpp"
#include <pqxx/pqxx>

int main()
{
  GameInstance gameInstance;
  ChessServer server;
  server.init();
  server.start();
  // std::cout << "Starting websocket server..." << std::endl;

  // websocket_server_run();
}