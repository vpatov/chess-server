
#include "server.hpp"
#include "game_instance.hpp"
#include "game_instance_manager.hpp"
#include "uuid.hpp"

int main()
{
  GameInstance gameInstance;
  ChessServer server;
  server.init();
  server.start();
}