FROM cpp-build-base:latest AS build

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

RUN cmake . && make

EXPOSE 59201
EXPOSE 59202

CMD /opt/chess-game-server/chess_server


# Build container with:
# sudo docker build -t chess-server -f chess-server.Dockerfile  .

# Run the container with:
# sudo docker run -d -p 59201:59201 -p 59202:59202 chess-server