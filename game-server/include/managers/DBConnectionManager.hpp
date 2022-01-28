
#pragma once

#include <pqxx/pqxx>

class DBConnectionManager {

public:
    pqxx::connection C;

    explicit DBConnectionManager(std::string connection_string) : C(connection_string) {

    }

    bool is_open() {
        return C.is_open();
    }

};