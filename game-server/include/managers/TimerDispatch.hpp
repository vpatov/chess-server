#pragma once
#include "EventProcessor.hpp"
#include <iostream>
#include <boost/asio.hpp>
#include <chrono>
#include <map>


class TimerDispatch {
public:
    boost::asio::io_context io;
    std::map<std::string, std::shared_ptr<boost::asio::steady_timer>> timers;

    std::shared_ptr<boost::asio::steady_timer> tt;


    void test_timer(uint64_t milliseconds, std::function<void(void)> callback) {
        if (tt == nullptr) {
            tt = std::make_shared<boost::asio::steady_timer>(
                boost::asio::steady_timer(
                    io, boost::asio::chrono::milliseconds(milliseconds)
                ));
        }
        else {
            tt->cancel();
        }

        tt->async_wait([this, callback](const boost::system::error_code& e) {
            callback();
        });

    }

    // after make move, the person whose turn it is loses in X seconds if they dont make a move
    // should call the lose function
    void start_game_instance_timeout_timer(std::string game_instance_uuid, long milliseconds, std::function<void(void)> callback) {
        std::cout << ColorCode::purple << "start_game_instance_timeout_timer ms: " << milliseconds << ColorCode::end << std::endl;
        auto old_timer = timers[game_instance_uuid];
        if (old_timer != nullptr) {
            std::cout << ColorCode::red << "cancelling old timer for " << game_instance_uuid << ColorCode::end << std::endl;
            old_timer->cancel();
            timers.erase(game_instance_uuid);
        }

        auto t = std::make_shared<boost::asio::steady_timer>(
            boost::asio::steady_timer(
                io, boost::asio::chrono::milliseconds(milliseconds)
            ));

        timers[game_instance_uuid] = t;

        t->async_wait([this, callback](const boost::system::error_code& e) {
            // only execute the callback if there is no error (if we cancel, error code is 125)
            if (e.value() == 0) {
                callback();
            }
        });
    }

    void cancel_game_instance_timeout_timer(std::string game_instance_uuid) {
        auto timer = timers[game_instance_uuid];
        if (timer != nullptr) {
            timer->cancel();
            timers.erase(game_instance_uuid);
        }
    }



    std::thread run() {
        auto t = std::thread([this] {
            {
                std::unique_lock<std::mutex> lock(STDOUT_MUTEX);
                std::cout << "Timer event loop started..." << std::endl;
            }
            boost::asio::io_service::work work(io);
            io.run();
        });
        return t;
    }

};