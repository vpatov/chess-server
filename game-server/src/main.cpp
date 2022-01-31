#include "external/di.hpp"

#include "chess_server.hpp"
#include "logger/logger.hpp"
#include "managers/DBConnectionManager.hpp"

#include <memory>

namespace di = boost::di;

int main()
{
    initialize_logger();
    const auto dbManager =
        std::make_shared<DBConnectionManager>("dbname=chess_server user=postgres");


    const auto injector = di::make_injector(
        di::bind<DBConnectionManager>.to(dbManager)
        );


    ChessServer server = injector.create<ChessServer>();

    server.m_http_server->init_logger();
    server.m_http_server->init_middleware();
    server.m_http_server->init_routes();
    std::thread http_thread = server.m_http_server->run();
    std::thread ws_thread = server.m_ws_server->run();
    http_thread.join();
    ws_thread.join();
    
    }

//     // server.http_server_init();
//     // server.start_http_server_thread();

//     // server.ws_server_init();
//     // server.start_ws_server_thread();
//     // server.http_server_thread.join();
//     // server.ws_server_thread.join();
// }