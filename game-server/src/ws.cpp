
// using websocketpp::lib::bind;
// using websocketpp::lib::placeholders::_1;
// using websocketpp::lib::placeholders::_2;

// // pull out the type of messages sent by our config
// typedef WsServer::message_ptr message_ptr;

// // Define a callback to handle incoming messages
// void on_message(WsServer *s, websocketpp::connection_hdl hdl, message_ptr msg)
// {
//     std::cout << "on_message called with hdl: " << hdl.lock().get()
//               << " and message: " << msg->get_payload()
//               << std::endl;

//     // check for a special command to instruct the server to stop listening so
//     // it can be cleanly exited.
//     if (msg->get_payload() == "stop-listening")
//     {
//         s->stop_listening();
//         return;
//     }

//     try
//     {
//         s->send(hdl, msg->get_payload(), msg->get_opcode());
//     }
//     catch (websocketpp::exception const &e)
//     {
//         std::cout << "Echo failed because: "
//                   << "(" << e.what() << ")" << std::endl;
//     }
// }
// void ChessServer::ws_server_start()
// {
//     m_ws_server->listen(8081);

//     // Start the server accept loop
//     m_ws_server->start_accept();

//     // Start the ASIO io_service run loop
//     m_ws_server->run();
// }

// void ChessServer::ws_server_init()
// {
//     // Create a server endpoint
//     try
//     {
//         // Set logging settings
//         m_ws_server->set_access_channels(websocketpp::log::alevel::all);
//         m_ws_server->clear_access_channels(websocketpp::log::alevel::frame_payload);

//         // Initialize Asio
//         m_ws_server->init_asio();

//         // Register our message handler
//         m_ws_server->set_message_handler(
//             bind(&on_message, m_ws_server.get(), std::placeholders::_1, std::placeholders::_2));
//     }
//     catch (websocketpp::exception const &e)
//     {
//         std::cout << e.what() << std::endl;
//     }
//     catch (...)
//     {
//         std::cout << "other exception" << std::endl;
//     }
// }
