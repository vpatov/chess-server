#include "models/user.hpp"
#include <iostream>

static User from_string(std::string_view text)
{
    std::cout << "from_string User: {" << text << "}" << std::endl;
    User user;
    return user;
}
//   static zview to_buf(char *begin, char *end, User const &value);
//   static char *into_buf(char *begin, char *end, User const &value);
//   static std::size_t size_buffer(User const &value) noexcept;