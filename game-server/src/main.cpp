#include "external/di.hpp"

#include "chess_server.hpp"
#include "logger/logger.hpp"
#include "managers/DBConnectionManager.hpp"
#include <boost/asio.hpp>
#include <thread>

#include <memory>

namespace di = boost::di;

void print(const boost::system::error_code& /*e*/)
{
    std::cout << "Hello, world!" << std::endl;
}

int main2()
{
    boost::asio::io_context io;
    boost::asio::io_service::work work(io);

    boost::asio::steady_timer t1(io, boost::asio::chrono::seconds(2));
    boost::asio::steady_timer t2(io, boost::asio::chrono::seconds(4));

    t1.async_wait(&print);
    t2.async_wait(&print);

    io.run();

    std::cout << "after sleeping" << std::endl;
    return 0;

}

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

    return 0;
}