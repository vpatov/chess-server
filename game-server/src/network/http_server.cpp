#include "network/HttpServer.hpp"

void HttpServer::init_logger()
{
    m_server.set_logger([this](const auto &req, const auto &res)
                        {
      std::string req_dump = "=== REQUEST === \nbody: {{{" + req.body + "}}}\n";
      req_dump += "headers: \n";
      for (auto it = req.headers.begin(); it != req.headers.end(); it++) {
        req_dump += it->first + ": " + it->second + "\n";
      }

      std::string res_dump =
          "=== RESPONSE === \nbody: {{{" + res.body + "}}}\n";
      res_dump += "headers: \n";
      for (auto it = res.headers.begin(); it != res.headers.end(); it++) {
        res_dump += it->first + ": " + it->second + "\n";
      }
      auto logger = spdlog::get("multi_sink");
      logger->debug("{}", req_dump);
      logger->debug("{}", res_dump); });
}

void HttpServer::init_middleware()
{
    m_server.set_post_routing_handler(
        [](const httplib::Request &req, httplib::Response &res)
        {
            res.set_header("Access-Control-Allow-Origin", "*");
        });

    m_server.set_exception_handler(
        [](const auto &req, auto &res, std::exception &e)
        {
            res.status = 500;
            auto fmt = "<h1>Error 500!</h1><p>%s</p>";
            char buf[BUFSIZ];
            snprintf(buf, sizeof(buf), fmt, e.what());
            res.set_content(buf, "text/html");
        });
}

void HttpServer::init_routes()
{

    m_server.Options(
        R"(/(.*))", [](const httplib::Request &req, httplib::Response &res)
        {
          res.set_header("Access-Control-Allow-Headers", "*");
          res.set_header("Access-Control-Allow-Methods", "OPTIONS,POST,GET");
          res.set_header("Content-Type", JSON_CONTENT_TYPE); });

    m_server.Get("/", [](const httplib::Request &req, httplib::Response &res)
                 {
      // json body = json::parse(req.body);
      json status = {{"name", "chess_server"}, {"status", "healthy"}};
      res.set_content(status.dump(), JSON_CONTENT_TYPE); });

    m_server.Post("/create_game", [this](const httplib::Request &req,
                                         httplib::Response &res)
                  {
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
      res.set_content(response.dump(), JSON_CONTENT_TYPE); });

    m_server.Post("/join_game", [this](const httplib::Request &req,
                                       httplib::Response &res)
                  {
      json body = json::parse(req.body);
      m_game_instance_manager->add_player(
          body["client_uuid"].get<std::string>(),
          body["game_instance_uuid"].get<std::string>());

      res.set_content((json{{"status", "ok"}}).dump(), JSON_CONTENT_TYPE); });
}




// m_server.Post(
//     "/legal_moves", [](const httplib::Request &req, httplib::Response
//     &res)
//     {
// json body = json::parse(req.body);
// if (!body.contains("fen")) {
//   res.status = 400;
//   res.set_content(
//       "The request must have a fen string as a value for \"fen\".",
//       "text/plain");
//   return;
// }

// std::string fen_string = body["fen"].get<std::string>();

// std::smatch matches;
// if (!std::regex_match(fen_string, matches, fen_regex)) {
//   res.status = 400;
//   res.set_content("Invalid fen string.", "text/plain");
//   return;
// }

// json moves = string_list_all_moves(fen_to_position(fen_string));
// res.set_content(moves.dump(), JSON_CONTENT_TYPE); });

//     m_server.Post("/signup", [this](const httplib::Request &req,
//                                      httplib::Response &res)
//                    {
// json body = json::parse(req.body);

// if (!body.contains("username") || !body.contains("password")) {
//   res.status = 400;
//   res.set_content("Invalid request.", "text/plain");
//   return;
// }

// json response =
// m_user_manager->signup(body["username"].get<std::string>(),
//                                        body["password"].get<std::string>());
// res.set_content(response.dump(), JSON_CONTENT_TYPE); });

//     m_server.Post(
//         "/login", [this](const httplib::Request &req, httplib::Response
//         &res)
//         {
//     json body = json::parse(req.body);

//     if (!body.contains("username") || !body.contains("password")) {
//       res.status = 400;
//       res.set_content("Invalid request.", "text/plain");
//       return;
//     }

//     bool valid_credentials = m_user_manager->validate_credentials(
//         body["username"].get<std::string>(),
//         body["password"].get<std::string>());

//     if (!valid_credentials) {
//       json response = {{"error", "Invalid login credentials."}};
//       res.set_content(response.dump(), JSON_CONTENT_TYPE);
//       return;
//     }
//     json response = {{"status", "ok"}};
//     res.set_content(response.dump(), JSON_CONTENT_TYPE); });
// }