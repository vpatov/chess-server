#include "network/WebSocketServer.hpp"

void WebSocketServer::_run()
{
    m_server.listen(8081);
    m_server.start_accept();
    m_server.run();
}