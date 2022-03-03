#pragma once

// #include "DBConnectionManager.hpp"
#include "models/user.hpp"

#include <boost/format.hpp>
// #include <fmt/core.h>
#include <string>
#include <memory>
#include <iomanip>
#include <iostream>
#include <sstream>
#include <nlohmann/json.hpp>
#include "uuid.hpp"

using json = nlohmann::json;

class UserManager
{
public:
    // std::shared_ptr<DBConnectionManager> m_db;

    // UserManager(std::shared_ptr<DBConnectionManager> _ptr) : m_db(_ptr) {}

    UserManager(){}
    /*
    std::shared_ptr<User> get_user(std::string username)
    {
        pqxx::work W{m_db->C};
        auto fmt_query = (boost::format("SELECT * FROM users WHERE username = '%1%'") % username);
        pqxx::result R{W.exec(fmt_query.str())};

        // Iterate over results.
        if (R.size() == 0)
        {
            return nullptr;
        }
        auto row = R.at(0);

        auto user = std::make_shared<User>();
        user->id = std::stol(row[0].c_str());
        user->username = row[1].c_str();
        user->salt_hexdigest = row[2].c_str();
        user->hashed_password_hexdigest = row[3].c_str();

        return user;
    }
*/
/*
    bool validate_credentials(std::string username, std::string password)
    {
        auto user = get_user(username);
        if (user == nullptr)
        {
            return false;
        }

        std::string salted_password = password + user->salt_hexdigest;
        std::string hashed_password_hexdigest = sha256(salted_password);

        std::cout << "validating credentials...." << std::endl;
        std::cout << "user: " << username << " password provided: " << password << std::endl;
        std::cout << "salt_hexdigest: " << user->salt_hexdigest << std::endl;
        std::cout << "salted_password: " << salted_password << std::endl;
        std::cout << "hashed_password_hexdigest: " << hashed_password_hexdigest << std::endl;

        return (hashed_password_hexdigest.compare(user->hashed_password_hexdigest) == 0);
    }
*/
/*
    json signup(std::string username, std::string password)
    {

        auto user = get_user(username);
        if (user != nullptr)
        {
            // return error, username is taken already
            auto fmt = boost::format("username %1% is taken already") % username;
            json response = {{"error", fmt.str()}};
            return response;
        }

        create_user(username, password);

        json response = {{"status", "ok"}};
        return response;
    }
*/
/*
    void create_user(std::string username, std::string password)
    {
        uint8_t salt[10];
        generate_random_bytes(salt, 10);

        std::string salt_hexdigest = bytes_to_hexdigest(salt, 10);
        std::string salted_password = password + salt_hexdigest;
        std::string hashed_password = sha256(salted_password);
        auto fmt = boost::format("INSERT INTO users (username, salt, hashed_password) VALUES"
                                 "('%1%', '%2%', '%3%');") %
                   username % salt_hexdigest % hashed_password;


        std::cout << "creating user...." << std::endl;
        std::cout << "user: " << username << " password: " << password << std::endl;
        std::cout << "salt_hexdigest: " << salt_hexdigest << std::endl;
        std::cout << "salted_password: " << salted_password << std::endl;
        std::cout << "hashed_password_hexdigest: " << hashed_password << std::endl;

        pqxx::work W{m_db->C};

        std::cout << fmt.str() << std::endl;
        W.exec0(fmt.str());
        W.commit();
    }
*/
/*
    User from_row(pqxx::row row)
    {
        long id = std::stol(row[0].c_str());
        std::string username = row[1].c_str();
        std::string salt_hexdigest = row[2].c_str();
        std::string hashed_password_hexdigest = row[3].c_str();
        return User(id, username, salt_hexdigest, hashed_password_hexdigest);
    }
*/
/*
    std::vector<User> get_all_users()
    {
        pqxx::work W{m_db->C};
        std::string query = "SELECT * FROM users";
        pqxx::result R{W.exec(query)};

        std::vector<User> users;
        for (auto it = R.begin(); it != R.end(); it++)
        {
            users.push_back(std::move(from_row(*it)));
        }

        return users;
    }
    */
};