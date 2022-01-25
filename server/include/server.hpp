#pragma once
#include "external/httplib.hpp"

class ChessServer {
public:
  httplib::Server m_svr;

  void init();
  void init_logger();
  void init_middleware();
  void init_routes();
  void start();
};
