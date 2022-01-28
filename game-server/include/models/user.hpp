#pragma once

#include <string>
#include <pqxx/pqxx>
#include <string_view>

struct User {
    long id;
    std::string username;
    std::string salt_hexdigest; //hexstring
    std::string hashed_password_hexdigest; //hexstring
};

namespace pqxx {
    template<> std::string const type_name<User>{"User"};
    template<>
    struct nullness<User> : pqxx::no_null<User> {
    };

    template<>
    struct string_traits<User> {
        static User from_string(std::string_view text);

        static zview to_buf(char *begin, char *end, User const &value);

        static char *into_buf(char *begin, char *end, User const &value);

        static std::size_t size_buffer(User const &value) noexcept;
    };
}