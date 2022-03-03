#include "external/di.hpp"

#include "chess_server.hpp"
#include "logger/logger.hpp"
#include "managers/DBConnectionManager.hpp"
#include <boost/asio.hpp>
#include <thread>
#include <iostream>
#include <memory>
#include <algorithm>


namespace di = boost::di;

int DEFAULT_HTTP_PORT = 59201;
int DEFAULT_WS_PORT = 59202;

char* get_arg(char ** begin, char ** end, const std::string & option)
{
    char ** itr = std::find(begin, end, option);
    if (itr != end && ++itr != end)
    {
        return *itr;
    }
    return 0;
}


int main(int argc, char* argv[])
{

    const char* ws_port_arg = get_arg(argv,argv+argc,"-wp");
    int ws_port = ws_port_arg ? std::stoi(ws_port_arg) : DEFAULT_WS_PORT;

    const char* http_port_arg = get_arg(argv,argv+argc,"-hp");
    int http_port = http_port_arg ? std::stoi(http_port_arg) : DEFAULT_HTTP_PORT;
    
    initialize_logger();
    const auto timerDispatch = std::make_shared<TimerDispatch>();
    const auto injector = di::make_injector(
        di::bind<TimerDispatch>.to(timerDispatch)
    );


    ChessServer server = injector.create<ChessServer>();

    // server.m_http_server->init_logger();
    server.m_http_server->init_middleware();
    server.m_http_server->init_routes();
    std::thread http_thread = server.m_http_server->run(http_port);
    std::thread ws_thread = server.m_ws_server->run(ws_port);
    std::thread timer_thread = server.m_ws_server->m_timer_dispatch->run();
    http_thread.join();
    ws_thread.join();
    timer_thread.join();

    return 0;
}