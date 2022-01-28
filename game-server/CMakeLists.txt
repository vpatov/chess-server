cmake_minimum_required(VERSION 3.5)
project(chess_server LANGUAGES C CXX VERSION 0.1.0)

file(GLOB_RECURSE INCLUDE_FILES ${PROJECT_SOURCE_DIR}/include/*.hpp)
file(GLOB_RECURSE SRC_FILES ${PROJECT_SOURCE_DIR}/src/*.cpp)

## Variables
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

set(Boost_USE_STATIC_LIBS OFF)
set(Boost_USE_MULTITHREADED ON)
set(Boost_USE_STATIC_RUNTIME OFF)
#set(BOOST_ROOT /usr/local/boost_1_76_0)


## Flags
if (CMAKE_COMPILER_IS_GNUCC)
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall -Wextra -pg")
endif ()
if (MSVC)
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} /W4")
endif ()

set(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} -pg")
set(CMAKE_SHARED_LINKER_FLAGS "${CMAKE_SHARED_LINKER_FLAGS} -pg")


# Find Packages
################################
find_package(Boost COMPONENTS algorithm format)

find_package(nlohmann_json CONFIG REQUIRED)
find_package(libpqxx CONFIG REQUIRED)
find_package(OpenSSL REQUIRED)

if (NOT PostgreSQL_FOUND)
    # find_package(PostgreSQL REQUIRED)
endif ()

if (NOT TARGET spdlog)
    # Stand-alone build
    find_package(spdlog REQUIRED)
    message("spdlog ${spdlog}")
endif ()

# Include Directories
include_directories(${Boost_INCLUDE_DIRS})
include_directories(include)

# Add library and executable
add_library(chess_server_lib ${INCLUDE_FILES} ${SRC_FILES})
add_executable(chess_server src/main.cpp)

# link libraries to target
target_link_libraries(chess_server PRIVATE nlohmann_json nlohmann_json::nlohmann_json)
target_link_libraries(chess_server PRIVATE chess_server_lib)
target_link_libraries(chess_server PRIVATE spdlog::spdlog)
target_link_libraries(chess_server PRIVATE pqxx)
target_link_libraries(chess_server PRIVATE PostgreSQL::PostgreSQL)
target_link_libraries(chess_server PRIVATE OpenSSL::SSL)
# target_link_libraries(chess_server PRIVATE fmt)

set(CMAKE_BUILD_TYPE Debug)


add_compile_definitions(PROJECT_ROOT_DIR="${CMAKE_CURRENT_SOURCE_DIR}/..")
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ../build)

set_target_properties(chess_server PROPERTIES LINKER_LANGUAGE CXX)

