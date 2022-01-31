#pragma once

#include <mutex>
#include "managers/GameInstanceManager.hpp"
#include "managers/UserManager.hpp"
#include "network/WebSocketServer.hpp"
#include "network/HttpServer.hpp"

class ChessServer
{
public:
    std::shared_ptr<HttpServer> m_http_server;
    std::shared_ptr<WebSocketServer> m_ws_server;

    // std::unique_ptr<std::mutex> stdout_mutex;

    // std::thread http_server_thread;
    // std::thread ws_server_thread;

    ChessServer(
        std::shared_ptr<HttpServer> http_server,
        std::shared_ptr<WebSocketServer> ws_server)
        : m_http_server(http_server),
          m_ws_server(ws_server)
    {
        // stdout_mutex = std::make_unique<std::mutex>();
    }


};
