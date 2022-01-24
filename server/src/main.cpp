#include <iostream>

#include "httplib.hpp"
#include <nlohmann/json.hpp>
#include "move_generation.hpp"
#include "representation/fen.hpp"
#include "representation/position.hpp"
#include "regex"

httplib::Server svr;

using json = nlohmann::json;

const std::regex fen_regex(
    R"(\s*^(((?:[rnbqkpRNBQKP1-8]+\/){7})[rnbqkpRNBQKP1-8]+)\s([b|w])\s(-|[K|Q|k|q]{1,4})\s(-|[a-h][36])\s(\d+\s\d+)$)");

int main()
{
    json status = {{"name", "chess_server"}, {"status", "healthy"}};

    svr.set_exception_handler([](const auto &req, auto &res, std::exception &e)
                              {
                                  res.status = 500;
                                  auto fmt = "<h1>Error 500! Nobody's perfect eh...</h1><p>%s</p>";
                                  char buf[BUFSIZ];
                                  snprintf(buf, sizeof(buf), fmt, e.what());
                                  res.set_content(buf, "text/html");
                              });

    svr.Get("/", [&status](const httplib::Request &req, httplib::Response &res)
            { res.set_content(status.dump(), "application/json"); });

    svr.Post("/legal_moves", [&status](const httplib::Request &req, httplib::Response &res)
             {
                 if (!req.has_param("fen"))
                 {
                     res.status = 400;
                     res.set_content("The request must have a fen string as a value for \"fen\".", "text/plain");
                     return;
                 }
                 std::string fen_string = req.get_param_value("fen");

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