// #include <chrono>
// #include <iostream>
// #include <nlohmann/json.hpp>
// #include <regex>

// #include "models/create_game_request.hpp"
// #include "move_generation.hpp"
// #include "representation/fen.hpp"
// #include "representation/position.hpp"
// #include "chess_server.hpp"

// #include <sstream>
// #include <thread>




// void ChessServer::start_ws_server_thread() {
//   ws_server_thread = std::thread([this] {
//     {
//       std::unique_lock<std::mutex> lock(*stdout_mutex);
//       std::cout << "WS Server listening on port 0.0.0.0:8081" << std::endl;
//     }
//     ws_server_start();
//   });
// }



// void ChessServer::http_server_init() {
//   init_http_logger();
//   init_http_middleware();
//   init_http_routes();
// }

