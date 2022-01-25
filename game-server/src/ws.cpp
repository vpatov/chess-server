#include "ws.hpp"

#define ASIO_STANDALONE
 
#include <websocketpp/config/asio_no_tls>
#include <websocketpp/server>
 
#include <functional>
 
typedef websocketpp::server<websocketpp::config::asio> server;
 
class utility_server {
public:
    utility_server() {
         // Set logging settings
        m_endpoint.set_error_channels(websocketpp::log::elevel::all);
        m_endpoint.set_access_channels(websocketpp::log::alevel::all ^ websocketpp::log::alevel::frame_payload);
 
        // Initialize Asio
        m_endpoint.init_asio();
    }
 
    void run() {
        // Listen on port 9002
        m_endpoint.listen(9002);
 
        // Queues a connection accept operation
        m_endpoint.start_accept();
 
        // Start the Asio io_service run loop
        m_endpoint.run();
    }
private:
    server m_endpoint;
};
 
void fn() {
    utility_server s;
    s.run();
}