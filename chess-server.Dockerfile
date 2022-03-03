FROM cpp-build-base:latest AS build
# FROM postgres:latest AS postgres

RUN apt-get -qq update 
RUN apt-get -qq install -y python3 python3-pip postgresql postgresql-contrib \
	libssl-dev libpq-dev postgresql-server-dev-all

RUN pip3 install cget

RUN cget install --prefix=/usr/local gabime/spdlog
RUN cget install --prefix=/usr/local nlohmann/json
RUN cget install --prefix=/usr/local jtv/libpqxx
RUN cget install --prefix=/usr/local zaphoyd/websocketpp
RUN cget install --prefix=/usr/local boost,http://downloads.sourceforge.net/project/boost/boost/1.78.0/boost_1_78_0.tar.bz2 --cmake boost

WORKDIR /opt/chess-game-server

COPY ./game-server ./

# RUN ["apt", "update"]
# RUN ["apt", "install", "-y", \
#         "python3", "python3-pip", "postgresql", "postgresql-contrib", \
#         "libssl-dev", "libpq-dev", "postgresql-server-dev-all"]

# RUN ["pip3", "install", "cget"]

# RUN ["cget", "install", "--prefix=/usr/local", "gabime/spdlog"]
# RUN ["cget", "install", "--prefix=/usr/local", "nlohmann/json"]
# RUN ["cget", "install", "--prefix=/usr/local", "jtv/libpqxx"]
# RUN ["cget", "install", "--prefix=/usr/local", "zaphoyd/websocketpp"]
# RUN ["cget", "install", "--prefix=/usr/local", "boost,http://downloads.sourceforge.net/project/boost/boost/1.78.0/boost_1_78_0.tar.bz2", "--cmake", "boost"]


RUN cmake . && make -j20

# WORKDIR /opt/chess-game-server

# COPY --from=build /src/helloworld ./

EXPOSE 59200
EXPOSE 59201
EXPOSE 59202

CMD /opt/chess-game-server/chess_server