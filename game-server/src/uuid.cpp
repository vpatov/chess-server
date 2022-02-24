#include "uuid.hpp"
#include "util.hpp"
#include <random>
#include <string>
#include <sstream>
#include <iomanip>
#include <iostream>
#include <fstream>
#include <unordered_set>
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


std::string bytes_to_hexdigest(uint8_t* src, size_t n) {
    std::ostringstream ss;
    ss << std::hex << std::uppercase << std::setfill('0');
    for (size_t i = 0; i < n; i++)
    {
        ss << std::hex << std::setw(2) << std::setfill('0') << (int)(*(src + i));
    }
    return ss.str();
}

void generate_random_bytes(uint8_t* dest, size_t n) {
    size_t i = 0;
    while (i < n) {
        *(dest + i) = random_bitstring();
        i++;
    }
}

std::string generate_readable_uuid()
{
    std::vector<std::string> adjectives;
    std::vector<std::string> animals;
    std::string id = std::to_string(random_bitstring() % 1000);

    std::string line;
    std::ifstream adjectives_file(project_root_dir / "words" / "adjectives.txt");
    if (adjectives_file.is_open())
    {
        while (std::getline(adjectives_file, line))
        {
            adjectives.push_back(line);
        }
        adjectives_file.close();
    }
    else {
        return std::string("error-") + id;
    }

    std::ifstream animals_file(project_root_dir / "words" / "animals.txt");
    if (animals_file.is_open())
    {
        while (std::getline(animals_file, line))
        {
            animals.push_back(line);
        }
        animals_file.close();
    }
    else {
        return std::string("error-") + id;
    }

    std::string adjective = adjectives.at(random_bitstring() % adjectives.size());
    std::string animal = animals.at(random_bitstring() % animals.size());

    std::string uuid =adjective + "-" + animal + "-" + id;
    std::cout << "readable uuid: {" << uuid << "}";
    return uuid;
}

std::string generate_uuid()
{
    /*
        Follows operation from https://www.cryptosys.net/pki/uuid-rfc4122.html,
        without the dashes
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
    return hexstring;
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
    for (int i = 0; i < SHA256_DIGEST_LENGTH; i++)
    {
        ss << hex << setw(2) << setfill('0') << (int)hash[i];
    }
    return ss.str();
}
