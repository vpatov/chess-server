#pragma once

#include <cmath>
#include <string>

uint64_t random_bitstring();
std::string generate_uuid();
std::string bytes_to_hexdigest(uint8_t *src, size_t n);
void generate_random_bytes(uint8_t *dest, size_t n);
std::string sha256(const std::string str);
std::string generate_readable_uuid();

