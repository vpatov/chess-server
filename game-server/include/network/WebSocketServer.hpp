
#pragma once

#include "util.hpp"
#include "models/api.hpp"
#include "models/client_connection_info.hpp"
#include "managers/GameInstanceManager.hpp"
#include "managers/ValidationService.hpp"
#include "managers/MessageProcessor.hpp"
#include <iostream>
#include <memory>
#include <map>
#include <unordered_map>
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
  typedef std::map<connection_hdl, ClientConnectionInfo, std::owner_less<connection_hdl>> connection_map;

  connection_map m_connection_client_uuid_map;

  websocketpp_server m_server;
  std::shared_ptr<GameInstanceManager> m_game_instance_manager;
  std::shared_ptr<ValidationService> m_validation_service;
  std::shared_ptr<MessageProcessor> m_message_processor;
  void _run();

public:
  WebSocketServer(std::shared_ptr<GameInstanceManager> game_instance_manager,
   std::shared_ptr<ValidationService> validation_service,
   std::shared_ptr<MessageProcessor> message_processor)
    : m_game_instance_manager(game_instance_manager),
    m_validation_service(validation_service),
    m_message_processor(message_processor) {
    // m_server.set_access_channels(websocketpp::log::alevel::all);
    // m_server.clear_access_channels(websocketpp::log::alevel::frame_payload);
    m_server.set_reuse_addr(true);
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
        std::cout << "WebSocket Server is listening on port 59202" << std::endl;
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

      // get clientUUID and gameInstanceUUID from connection query params
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

      // throw if query params were invalid for connection
      if (client_uuid.size() == 0 || game_instance_uuid.size() == 0) {
        throw std::invalid_argument("clientUUID and gameInstanceUUID must be provided in the WS connection query params.");
      }

      m_game_instance_manager->add_player(client_uuid, game_instance_uuid);
      auto player = m_game_instance_manager->get_player(client_uuid, game_instance_uuid);

      m_game_instance_manager->start_game(game_instance_uuid); // TODO remove this line
      m_connection_client_uuid_map[hdl] = ClientConnectionInfo(client_uuid, game_instance_uuid);
      m_game_instance_manager->add_connection_handle(game_instance_uuid, hdl);

      json game_init_message = {
        {"messageType", messageTypeString[ServerMessageType::GAME_INIT]}, {"payload", {{"client_playing_white", player->white}}}
      };
      m_server.send(hdl,
        game_init_message.dump(),
        websocketpp::frame::opcode::TEXT);

      json game_state_update_message = {
        {"messageType", messageTypeString[ServerMessageType::GAME_STATE_UPDATE]}, 
        {"payload", m_game_instance_manager->get_game_state_json(game_instance_uuid)}
      };
      m_server.send(hdl,
        game_state_update_message.dump(),
        websocketpp::frame::opcode::TEXT);
    }
    catch (const std::exception& e) {
      std::cout << "Exception while opening a connection: " << e.what() << std::endl;
    }

  }

  void on_close(connection_hdl hdl) {
    ClientConnectionInfo ccinfo = m_connection_client_uuid_map[hdl];
    m_game_instance_manager->remove_connection_handle(ccinfo.game_instance_uuid, hdl);
    m_connection_client_uuid_map.erase(hdl);
  }

  void on_fail(connection_hdl hdl) {
    std::cout << "on fail" << std::endl;
  }

  void on_message(connection_hdl hdl, message_ptr msg) {
    std::cout << "incoming message: \n" << ColorCode::blue << msg->get_payload() << ColorCode::end << std::endl;
    try {
      json body = json::parse(msg->get_payload());
      ClientConnectionInfo ccinfo = m_connection_client_uuid_map[hdl];
      ClientWsMessage ws_action(body["type"].get<ActionType>(), body["payload"].get<std::string>());

      // throws for now, but in the future should return an error object instead
      m_validation_service->validate_ws_action(ccinfo, ws_action);

      // update (mutate) game state
      m_message_processor->process_message(ccinfo, ws_action);

      // retrive updated state
      json game_state_update_message = {
        {"messageType", messageTypeString[ServerMessageType::GAME_STATE_UPDATE]}, 
        {"payload", m_game_instance_manager->get_game_state_json(ccinfo.game_instance_uuid)}
      };

      // broadcast to connections of that game
      for (auto it : *(m_game_instance_manager->get_connections(ccinfo.game_instance_uuid))) {
        // TODO if this tries to send to a dead connection, it throws an exception
        // can surround just this in a specific try block, and remove failing connection handles from
        // the map.
        m_server.send(it, game_state_update_message.dump(), websocketpp::frame::opcode::TEXT);
      }
    }
    catch (websocketpp::exception const& e)
    {
      std::cout << ColorCode::red << "on_message: websocketpp::exception: " << e.what() << ColorCode::end << std::endl;
    }
    catch (std::invalid_argument const& e)
    {
      std::cout << ColorCode::red << "invalid_argument in on_message: " << e.what() << ColorCode::end<< std::endl;
    }
    catch (json::exception const &e){
      std::cout << ColorCode::red << "json exception in on_message: " << e.what() << ColorCode::end << std::endl;
    }
  }

};
