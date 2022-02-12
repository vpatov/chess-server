#pragma once
#include <string>

struct ClientConnectionInfo {
  std::string client_uuid;
  std::string game_instance_uuid;

  ClientConnectionInfo() {}
  ClientConnectionInfo(std::string client_uuid, std::string game_instance_uuid) :
    client_uuid(client_uuid), game_instance_uuid(game_instance_uuid) {}
};

