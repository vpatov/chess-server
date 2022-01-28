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

// @app.route('/signup', methods=['POST'])
// def signup():
//     json_body = json.loads(request.data)
//     username = json_body['username']
//     password: str = json_body['password']

//     if (get_user(username) is not None):
//         return json.dumps({'error':'Username {} is taken already.'.format(username)})

//     salt_hexdigest = os.urandom(10)
//     salted_password_bytes = password.encode() + salt_hexdigest

//     print("password: ", password)
//     print("salted_password_bytes: ", salted_password_bytes)

//     hashed_password_hexdigest = hashlib.sha256(salted_password_bytes)

//     cur = conn.cursor()

//     query = """
//     INSERT INTO users (username, salt_hexdigest, hashed_password_hexdigest) VALUES
//         ('{}', '{}', '{}');
//         """.format(username, salt_hexdigest.hex(), hashed_password_hexdigest.hexdigest())
//     print(query)
//     cur.execute(query)

//     conn.commit()
//     cur.close()

//     return json.dumps({
//         'status': 'ok',
//         'username': username,
//         'hashed_password_hexdigest': hashed_password_hexdigest.hexdigest(),
//         'salt_hexdigest': salt_hexdigest.hex()})

// @app.route('/login',methods=['POST'])
// def login():
//     json_body = json.loads(request.data)
//     username = json_body['username']
//     password = json_body['password']

//     user = get_user(username)
//     if (user is None):
//         return json.dumps({'error':'Username {} is not registered.'.format(username)})

//     (user_id, _username, salt_hexdigest, stored_hash) = user
//     assert(username == _username)

//     salted_password_bytes = password.encode() + bytes.fromhex(salt_hexdigest)
//     hashed_password_hexdigest = hashlib.sha256(salted_password_bytes)

//     if (hashed_password_hexdigest.hexdigest() == stored_hash):
//         return json.dumps({'status': 'ok'})
//     else:
//         return json.dumps({'error': 'Incorrect password.'})

// void fn(){

// }