
#pragma once
#include <pqxx/pqxx>

class DBConnectionManager {
    // pqxx::connection C("dbname=chess_server user=postgres");
    pqxx::connection C;

    explicit DBConnectionManager(std::string connection_string) : C(connection_string){

    }
    public:
    
    bool is_open(){
        return C.is_open();
    }
    
};