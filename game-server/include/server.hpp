#pragma once

#include "external/httplib.hpp"
#include "managers/GameManager.hpp"
#include "managers/UserManager.hpp"

class ChessServer {
public:
    std::shared_ptr<httplib::Server> m_svr;
    std::shared_ptr<GameManager> m_game_manager;
    std::shared_ptr<UserManager> m_user_manager;

    ChessServer(
            std::shared_ptr<GameManager> gameManager,
            std::shared_ptr<UserManager> userManager,
            std::shared_ptr<httplib::Server> svr)
            : m_game_manager(gameManager), m_user_manager(userManager), m_svr(svr) {}


    void init();

    void init_logger();

    void init_middleware();

    void init_routes();

    void start();
};
