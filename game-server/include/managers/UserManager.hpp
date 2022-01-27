#pragma once

#include "DBConnectionManager.hpp"


class UserManager {
    public:
    std::shared_ptr<DBConnectionManager> dbConnectionManager;

    UserManager(std::shared_ptr<DBConnectionManager> _ptr) : dbConnectionManager(_ptr) {}
};