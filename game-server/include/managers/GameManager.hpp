#pragma once
#include "DBConnectionManager.hpp"
#include <memory>

class GameManager {
    public:
    std::shared_ptr<DBConnectionManager> dbConnectionManager;

    GameManager(std::shared_ptr<DBConnectionManager> _ptr) : dbConnectionManager(_ptr) {}
};