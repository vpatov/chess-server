#include <iostream>

#include "httplib.hpp"

httplib::Server svr;

int main()
{
    svr.Get("/hi", [](const httplib::Request &, httplib::Response &res)
            { res.set_content("Hello World!", "text/plain"); });
    svr.listen("0.0.0.0", 8080);
}