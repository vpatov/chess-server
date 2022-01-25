cmake_minimum_required(VERSION 3.5)
project(chess_server LANGUAGES C CXX VERSION 0.1.0)


set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

find_package(nlohmann_json 3.2.0 REQUIRED)
set(Boost_USE_STATIC_LIBS OFF) 
set(Boost_USE_MULTITHREADED ON)  
set(Boost_USE_STATIC_RUNTIME OFF) 
set(BOOST_ROOT /usr/local/boost_1_76_0)

find_package(Boost 1.76.0 COMPONENTS algorithm format) 

include_directories( ${Boost_INCLUDE_DIRS} )

if(NOT TARGET spdlog)
    # Stand-alone build
    find_package(spdlog REQUIRED)
endif()



if ( CMAKE_COMPILER_IS_GNUCC )
    set(CMAKE_CXX_FLAGS  "${CMAKE_CXX_FLAGS} -Wall -Wextra -pg")
endif()
if ( MSVC )
    set(CMAKE_CXX_FLAGS  "${CMAKE_CXX_FLAGS} /W4")
endif()

set(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} -pg")
set(CMAKE_SHARED_LINKER_FLAGS "${CMAKE_SHARED_LINKER_FLAGS} -pg")


# find_package(OpenSSL REQUIRED)
# target_link_libraries(chess_server OpenSSL::SSL)

set(SOURCES
    src/move_generation.cpp
    src/representation/fen.cpp
    src/representation/notation.cpp
    src/representation/position.cpp
    src/server.cpp
    src/game_instance_manager.cpp
    src/uuid.cpp
    src/login.cpp
    src/ws.cpp
    include/login.hpp
    include/move_generation.hpp
    include/server.hpp
    include/external/httplib.hpp
    include/util.hpp
    include/representation/color.hpp
    include/representation/fen.hpp
    include/representation/move.hpp
    include/representation/notation.hpp
    include/representation/offsets.hpp
    include/representation/pieces.hpp
    include/representation/position.hpp
    include/representation/squares.hpp
    include/game_instance.hpp
    include/game_instance_manager.hpp
    include/uuid.hpp
    include/ws.hpp
)

# find_package(PQXX REQUIRED)
# set(PQXX /usr/local/include/pqxx)
# find_package(PostgreSQL REQUIRED)
# find_package(libpqxx REQUIRED)
# find_library(PQXX_LIB pqxx /usr/local/include/pqxx REQUIRED)
# message("lipqxx_LIBRARIES=${PQXX_LIB}")
# find_library(PQ_LIB pq)
# message("PQ_LIB=${PQ_LIB}")

# if (libpqxx_FOUND)
#     message("found libpqxx")
# endif()

find_package(websocketpp REQUIRED)


add_library (chess_server_lib ${SOURCES})
add_executable (chess_server src/main.cpp)

target_link_libraries(chess_server PRIVATE nlohmann_json::nlohmann_json)
target_link_libraries(chess_server PRIVATE chess_server_lib)
target_link_libraries(chess_server PRIVATE spdlog::spdlog)
target_link_libraries(chess_server PRIVATE websocketpp::websocketpp)
# target_link_libraries(chess_server PRIVATE libpqxx:pqxx)
# target_link_libraries(chess_server PRIVATE ${PQ_LIB})


include_directories(include)
target_include_directories(chess_server PRIVATE include)

add_compile_definitions(PROJECT_ROOT_DIR="${CMAKE_CURRENT_SOURCE_DIR}/..")
set (CMAKE_RUNTIME_OUTPUT_DIRECTORY ../build)



set_target_properties(chess_server PROPERTIES LINKER_LANGUAGE CXX)

