#include "uuid.hpp"
#include <random>
#include <sstream>
#include <iomanip>
#include <iostream>

uint64_t random_bitstring()
{
    std::random_device rd;
    std::mt19937_64 e2(rd());
    std::uniform_int_distribution<uint64_t> dist(std::llround(std::pow(2, 61)),
                                                 std::llround(std::pow(2, 62)));
    return dist(e2);
}

std::string generate_uuid()
{
    /*
        Follows operation from https://www.cryptosys.net/pki/uuid-rfc4122.html
    */
    uint64_t a = random_bitstring();
    uint64_t b = random_bitstring();

    a &= 0xffffffffffff4fff;
    b &= 0xdfffffffffffffff;

    std::stringstream stream;
    stream << std::setfill('0') << std::setw(sizeof(uint64_t) * 2) << std::hex << a;
    stream << std::setfill('0') << std::setw(sizeof(uint64_t) * 2) << std::hex << b;
    std::string hexstring(stream.str());

    assert(hexstring.size() == 32);

    return hexstring.substr(0, 8) + "-" +
           hexstring.substr(8, 4) + "-" +
           hexstring.substr(12, 4) + "-" +
           hexstring.substr(16, 4) + "-" +
           hexstring.substr(20, 12);
}