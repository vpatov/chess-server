#pragma once
#include "EventProcessor.hpp"
#include <iostream>
#include <boost/asio.hpp>
#include <chrono>
#include <map>

using namespace ColorCode;

const std::string GAME_INSTANCE_CLEANUP_TIMER = std::string("GAME_INSTANCE_CLEANUP_TIMER");

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
        auto old_timer = timers[game_instance_uuid];
        if (old_timer != nullptr) {
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

    void cancel_timer(std::string timer_uuid) {
        auto timer = timers.find(timer_uuid);
        if (timer != timers.end()){
            timer->second->cancel();
            timers.erase(timer_uuid);
        }
    }

    void start_game_instance_cleanup_loop(std::function<void(void)> callback) {
        cancel_timer(GAME_INSTANCE_CLEANUP_TIMER);
        
        auto timer = std::make_shared<boost::asio::steady_timer>(boost::asio::steady_timer(io, boost::asio::chrono::seconds(5)));
        timer->async_wait([this, callback](const boost::system::error_code& e) {
            // only execute the callback if there is no error (if we cancel, error code is 125)
            if (e.value() == 0) {
                callback();
            }
            start_game_instance_cleanup_loop(callback);

        });

        timers[GAME_INSTANCE_CLEANUP_TIMER] = timer;
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