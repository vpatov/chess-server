sudo docker build -t chess-ui -f chess-ui.Dockerfile .
sudo docker build -t chess-server -f chess-server.Dockerfile  .

sudo docker ps -a -q --filter ancestor=chess-ui
sudo docker ps -a -q --filter ancestor=chess-server

sudo docker run -d -p 80:59200 chess-ui
sudo docker run -d -p 59201:59201 -p 59202:59202 chess-server


