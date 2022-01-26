#include "uuid.hpp"
#include <random>
#include <string>
#include <sstream>
#include <iomanip>
#include <iostream>
#include <sstream>
#include <cassert>
#include "openssl/sha.h"

uint64_t random_bitstring()
{
    std::random_device rd;
    std::mt19937_64 e2(rd());
    std::uniform_int_distribution<uint64_t> dist(std::llround(std::pow(2, 61)),
                                                 std::llround(std::pow(2, 62)));
    return dist(e2);
}


std::string bytes_to_hexdigest(uint8_t *src, size_t n){
    std::ostringstream ss;
    ss << std::hex << std::uppercase << std::setfill('0');
    for (size_t i = 0; i < n; i++)
    {
        ss << std::setw(2) << *(src + i);
    }
    return ss.str();
}

void generate_random_bytes(uint8_t *dest, size_t n){
    size_t i = 0;
    while(i < n - 8){
        *((uint64_t*)(dest)) = random_bitstring();
        i+=8;
    }
    while(i < n){
        (*dest) = random_bitstring() & 0xff;
        i++;
    }
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

using namespace std;
string sha256(const string str)
{
    unsigned char hash[SHA256_DIGEST_LENGTH];
    SHA256_CTX sha256;
    SHA256_Init(&sha256);
    SHA256_Update(&sha256, str.c_str(), str.size());
    SHA256_Final(hash, &sha256);
    stringstream ss;
    for(int i = 0; i < SHA256_DIGEST_LENGTH; i++)
    {
        ss << hex << setw(2) << setfill('0') << (int)hash[i];
    }
    return ss.str();
}
    