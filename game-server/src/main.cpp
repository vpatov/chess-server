
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

    std::string game_instance_uuid = server.m_game_instance_manager->create_game_instance();
    server.m_game_instance_manager->add_player(57,game_instance_uuid, true);
    server.m_game_instance_manager->add_player(56,game_instance_uuid, false);

    server.init();
    server.start();
}