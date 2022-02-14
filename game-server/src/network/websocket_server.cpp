#include "network/WebSocketServer.hpp"

void WebSocketServer::_run()
{
    m_server.listen(59202);
    m_server.start_accept();
    m_server.run();
}