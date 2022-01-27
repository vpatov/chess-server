
#include "server.hpp"
#include "game_instance.hpp"
#include "game_instance_manager.hpp"
#include "uuid.hpp"
#include "ws.hpp"
#include <pqxx/pqxx>
#include <memory>

#include "external/di.hpp"
namespace di = boost::di;

class ctor
{
public:
  explicit ctor(int i) : i(i) {}
  int i;
};

struct aggregate
{
  double d;
};

class example
{
public:
  example(aggregate a, const ctor &c)
  {
    assert(87.0 == a.d);
    assert(42 == c.i);
  };
};

class database_driver
{
public:
  explicit database_driver(int i) : i(i) {}
  int i;
};

class random_server
{
public:
  explicit random_server(std::shared_ptr<database_driver> driver) : m_driver(driver) {}
  std::shared_ptr<database_driver> m_driver;
};

class http_server
{
public:
  explicit http_server(std::shared_ptr<database_driver> driver) : m_driver(driver) {}
  std::shared_ptr<database_driver> m_driver;
};

class main_server
{
public:
  explicit main_server(
      std::shared_ptr<http_server> hserver,
      std::shared_ptr<random_server> rserver)
      : m_hserver(hserver), m_rserver(rserver)
  {
  }
  std::shared_ptr<http_server> m_hserver;
  std::shared_ptr<random_server> m_rserver;
};

int main()
{
  const auto injector = di::make_injector(
      di::bind<int>.to(42));

  auto instance = injector.create<main_server>();
  std::cout << instance.m_hserver->m_driver << std::endl;
  std::cout << instance.m_rserver->m_driver << std::endl;
}

// int main()
// {
//   // GameInstance gameInstance;
//   // ChessServer server;
//   // server.init();
//   // server.start();
//   // std::cout << "Starting websocket server..." << std::endl;

//   // websocket_server_run();
// }