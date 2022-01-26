#define FMT_HEADER_ONLY

#include "login.hpp"
#include "models/user.hpp"
#include <fmt/core.h>
#include <fmt/format.h>
#include <string>
#include <memory>
#include <iomanip>
#include <iostream>
#include <sstream>
#include <nlohmann/json.hpp>
#include "uuid.hpp"

using json = nlohmann::json;

std::shared_ptr<User> get_user(std::string username)
{
    pqxx::connection C("dbname=chess_server user=postgres");
    pqxx::work W{C};
    pqxx::result R{W.exec(
        fmt::format("SELECT * FROM users WHERE username = '{}'", username))};

    // Iterate over results.
    if (R.size() == 0)
    {
        return nullptr;
    }
    auto row = R.at(0);

    auto user = std::make_shared<User>();
    user->id = std::stol(row[0].c_str());
    user->username = row[1].c_str();
    user->salt = row[2].c_str();
    user->hashed_password = row[3].c_str();
    C.close();


    return user;
}

json signup(std::string username, std::string password)
{

    auto user = get_user(username);
    if (user != nullptr)
    {
        // return error, username is taken already
        json response = {"error", fmt::format("username {} is taken already", username)};
        return response;
    }

    uint8_t salt[20];
    generate_random_bytes(salt, 20);

    std::string salt_hexdigest = bytes_to_hexdigest(salt, 20);
    std::string salted_password = password + salt_hexdigest;
    std::string hashed_password = sha256(salted_password);

    std::string query = fmt::format("INSERT INTO users (username, salt, hashed_password) VALUES"
                                    "('{}', '{}', '{}')",
                                    username, salt_hexdigest, hashed_password);

    pqxx::connection C("dbname=chess_server user=postgres");
    pqxx::work W{C};
    W.exec0(query);
    W.commit();

    json response = {"status", "ok"};
    C.close();
    return response;
}

// @app.route('/signup', methods=['POST'])
// def signup():
//     json_body = json.loads(request.data)
//     username = json_body['username']
//     password: str = json_body['password']

//     if (get_user(username) is not None):
//         return json.dumps({'error':'Username {} is taken already.'.format(username)})

//     salt = os.urandom(10)
//     salted_password_bytes = password.encode() + salt

//     print("password: ", password)
//     print("salted_password_bytes: ", salted_password_bytes)

//     hashed_password = hashlib.sha256(salted_password_bytes)

//     cur = conn.cursor()

//     query = """
//     INSERT INTO users (username, salt, hashed_password) VALUES
//         ('{}', '{}', '{}');
//         """.format(username, salt.hex(), hashed_password.hexdigest())
//     print(query)
//     cur.execute(query)

//     conn.commit()
//     cur.close()

//     return json.dumps({
//         'status': 'ok',
//         'username': username,
//         'hashed_password': hashed_password.hexdigest(),
//         'salt': salt.hex()})

// @app.route('/login',methods=['POST'])
// def login():
//     json_body = json.loads(request.data)
//     username = json_body['username']
//     password = json_body['password']

//     user = get_user(username)
//     if (user is None):
//         return json.dumps({'error':'Username {} is not registered.'.format(username)})

//     (user_id, _username, salt, stored_hash) = user
//     assert(username == _username)

//     salted_password_bytes = password.encode() + bytes.fromhex(salt)
//     hashed_password = hashlib.sha256(salted_password_bytes)

//     if (hashed_password.hexdigest() == stored_hash):
//         return json.dumps({'status': 'ok'})
//     else:
//         return json.dumps({'error': 'Incorrect password.'})

// void fn(){

// }