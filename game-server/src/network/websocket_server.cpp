#include "network/WebSocketServer.hpp"

// TODO bring code into this file and out of the header file to speed up compilation
// fix these errors:

/*
Exception while opening a connection: gameInstanceUUID must be provided in the WS connection query params.
Exception while trying to close a connection: Couldn't find game instance with uuid: 
Exception while opening a connection: gameInstanceUUID must be provided in the WS connection query params.
"/home/vas/repos/chess-server/game-server/words/adjectives.txt"
readable uuid: {melodic-muskox-968}Exception while trying to close a connection: Couldn't find game instance with uuid: 
Exception while opening a connection: Couldn't find game instance with uuid: melodic
*/

void WebSocketServer::_run()
{
    m_server.listen(59202);
    m_server.start_accept();
    m_server.run();
}