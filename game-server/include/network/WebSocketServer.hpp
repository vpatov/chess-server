
#pragma once

#include "util.hpp"
#include "managers/GameInstanceManager.hpp"
#include <iostream>
#include <memory>
#include <set>
#include <websocketpp/config/asio_no_tls.hpp>
#include <websocketpp/roles/client_endpoint.hpp>
#include <websocketpp/server.hpp>
#include <websocketpp/frame.hpp>
#include <regex>

const std::regex query_param_regex(
    R"((\w+?)=([0-9a-z]+)&?)");


using websocketpp::connection_hdl;
using websocketpp::lib::bind;
using websocketpp::lib::placeholders::_1;
using websocketpp::lib::placeholders::_2;

typedef websocketpp::server<websocketpp::config::asio> websocketpp_server;
typedef websocketpp_server::message_ptr message_ptr;

class WebSocketServer {
private:
  typedef std::set<connection_hdl, std::owner_less<connection_hdl>> connections;

  connections m_connections;
  websocketpp_server m_server;
  std::shared_ptr<GameInstanceManager> m_game_instance_manager;
  void _run();

public:
  WebSocketServer(std::shared_ptr<GameInstanceManager> game_instance_manager)
    : m_game_instance_manager(game_instance_manager) {
    m_server.set_access_channels(websocketpp::log::alevel::all);
    m_server.clear_access_channels(websocketpp::log::alevel::frame_payload);
    m_server.init_asio();

    m_server.set_open_handler(bind(&WebSocketServer::on_open, this, ::_1));
    m_server.set_close_handler(bind(&WebSocketServer::on_close, this, ::_1));
    m_server.set_fail_handler(bind(&WebSocketServer::on_fail, this, ::_1));
    m_server.set_message_handler(
        bind(&WebSocketServer::on_message, this, ::_1, ::_2));
  }

  std::thread run() {
    auto t = std::thread([this] {
      {
        std::unique_lock<std::mutex> lock(STDOUT_MUTEX);
        std::cout << "WebSocket Server is listening on port 8081" << std::endl;
      }
      _run();
    });
    return t;
  }


  // TODO set exception handler so that gameInstance=1234 doesnt crash app
  // could be similar to http server exception handler
  void on_open(connection_hdl hdl) {
    try {

      std::string client_uuid, game_instance_uuid;

      websocketpp_server::connection_ptr connection = m_server.get_con_from_hdl(hdl);
      std::string query_string = connection->get_uri()->get_query();
      auto matches_begin =
        std::sregex_iterator(query_string.begin(), query_string.end(), query_param_regex);

      for (std::sregex_iterator it = matches_begin; it != std::sregex_iterator(); ++it) {
        std::smatch match = *it;
        if (match[1].compare("clientUUID") == 0) {
          client_uuid = match[2];
        }
        else if (match[1].compare("gameInstanceUUID") == 0) {
          game_instance_uuid = match[2];
        }
      }

      if (client_uuid.size() == 0 || game_instance_uuid.size() == 0) {
        throw std::invalid_argument("clientUUID and gameInstanceUUID must be provided in the WS connection query params.");
      }

      m_game_instance_manager->add_player(client_uuid, game_instance_uuid);
      m_connections.insert(hdl);

      m_server.send(hdl,
        m_game_instance_manager->get_game_state_json(game_instance_uuid),
        websocketpp::frame::opcode::TEXT);
    }
    catch (const std::exception& e) {
      std::cout << "Exception while opening a connection: " << e.what() << std::endl;
    }

  }

  void on_close(connection_hdl hdl) { m_connections.erase(hdl); }

  void on_fail(connection_hdl hdl) {
    std::cout << "on fail" << std::endl;
  }


  void on_message(connection_hdl hdl, message_ptr msg) {
    std::cout << "on_message: " << msg->get_payload() << std::endl;
    for (auto it : m_connections) {
      m_server.send(it, msg);
    }
  }
};

// Define a callback to handle incoming messages
// void
// on_message(websocketpp_server *s, websocketpp::connection_hdl hdl,
// message_ptr msg)
// {

//     try
//     {
//         s->send(hdl, msg->get_payload(), msg->get_opcode());
//     }
//     catch (websocketpp::exception const &e)
//     {
//         std::cout << "Echo failed because: "
//                   << "(" << e.what() << ")" << std::endl;
//     }
// }

// void ChessServer::ws_server_init()
// {
//     // Create a server endpoint
//     try
//     {
//         // Set logging settings
//         m_ws_server->set_access_channels(websocketpp::log::alevel::all);
//         m_ws_server->clear_access_channels(websocketpp::log::alevel::frame_payload);

//         // Initialize Asio
//         m_ws_server->init_asio();

//         // Register our message handler
//         m_ws_server->set_message_handler(
//             bind(&on_message, m_ws_server.get(), std::placeholders::_1,
//             std::placeholders::_2));
//     }
//     catch (websocketpp::exception const &e)
//     {
//         std::cout << e.what() << std::endl;
//     }
//     catch (...)
//     {
//         std::cout << "other exception" << std::endl;
//     }
// }
