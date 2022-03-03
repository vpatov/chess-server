#include "network/WebSocketServer.hpp"

void WebSocketServer::_run(int port)
{
    m_server.listen(port);
    m_server.start_accept();
    m_server.run();
}