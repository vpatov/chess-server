#pragma once

#include "external/httplib.hpp"
#include "managers/GameInstanceManager.hpp"
#include "managers/UserManager.hpp"

class ChessServer {
public:
    std::shared_ptr<httplib::Server> m_svr;
    std::shared_ptr<GameInstanceManager> m_game_instance_manager;
    std::shared_ptr<UserManager> m_user_manager;

    ChessServer(
            std::shared_ptr<GameInstanceManager> gameManager,
            std::shared_ptr<UserManager> userManager,
            std::shared_ptr<httplib::Server> svr)
            :  m_svr(svr), m_game_instance_manager(gameManager), m_user_manager(userManager) {}


    void init();

    void init_logger();

    void init_middleware();

    void init_routes();

    void start();
};
