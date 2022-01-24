cmake_minimum_required(VERSION 3.5)
project(chess_server LANGUAGES C CXX VERSION 0.1.0)


set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# if ( CMAKE_COMPILER_IS_GNUCC )
#     set(CMAKE_CXX_FLAGS  "${CMAKE_CXX_FLAGS} -Wall -Wextra -pg")
# endif()
# if ( MSVC )
#     set(CMAKE_CXX_FLAGS  "${CMAKE_CXX_FLAGS} /W4")
# endif()

# set(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} -pg")
# set(CMAKE_SHARED_LINKER_FLAGS "${CMAKE_SHARED_LINKER_FLAGS} -pg")


# find_package(OpenSSL REQUIRED)
# target_link_libraries(chess_server OpenSSL::SSL)

set(SOURCES
    src/foo.cpp
    include/httplib.hpp
)

add_library (chess_server_lib ${SOURCES})
add_executable (chess_server src/main.cpp)
target_link_libraries (chess_server PRIVATE chess_server_lib)
target_include_directories(chess_server PRIVATE include)



set_target_properties(chess_server PROPERTIES LINKER_LANGUAGE CXX)

