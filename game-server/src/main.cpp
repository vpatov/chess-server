#include "external/di.hpp"

#include "chess_server.hpp"
#include "logger/logger.hpp"
#include "managers/DBConnectionManager.hpp"
#include <boost/asio.hpp>
#include <thread>
#include <iostream>
#include <memory>

namespace di = boost::di;

int main()
{
    initialize_logger();
    const auto dbManager =
        std::make_shared<DBConnectionManager>("dbname=chess_server user=postgres");

    const auto timerDispatch = std::make_shared<TimerDispatch>();
    const auto injector = di::make_injector(
        di::bind<DBConnectionManager>.to(dbManager),
        di::bind<TimerDispatch>.to(timerDispatch)
    );


    ChessServer server = injector.create<ChessServer>();

    // server.m_http_server->init_logger();
    server.m_http_server->init_middleware();
    server.m_http_server->init_routes();
    std::thread http_thread = server.m_http_server->run();
    std::thread ws_thread = server.m_ws_server->run();
    std::thread timer_thread = server.m_ws_server->m_timer_dispatch->run();
    http_thread.join();
    ws_thread.join();
    timer_thread.join();

    return 0;
}