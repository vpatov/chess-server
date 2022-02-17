#pragma once

#include "network/WebSocketServer.hpp"
#include "network/HttpServer.hpp"

class ChessServer
{
public:
    std::shared_ptr<HttpServer> m_http_server;
    std::shared_ptr<WebSocketServer> m_ws_server;

    ChessServer(
        std::shared_ptr<HttpServer> http_server,
        std::shared_ptr<WebSocketServer> ws_server)
        : m_http_server(http_server),
        m_ws_server(ws_server)
    {}


};
