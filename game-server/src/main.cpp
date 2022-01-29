
#include "server.hpp"
#include "ws.hpp"
#include <memory>

#include "managers/DBConnectionManager.hpp"
#include "external/di.hpp"

namespace di = boost::di;

int main()
{
    const auto dbManager =
        std::make_shared<DBConnectionManager>("dbname=chess_server user=postgres");

    const auto injector = di::make_injector(
        di::bind<DBConnectionManager>.to(
            dbManager));

    ChessServer server = injector.create<ChessServer>();
    
    server.init();
    server.start();
}