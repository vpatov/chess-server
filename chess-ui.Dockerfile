FROM ubuntu:focal
FROM node:14

ENV TZ=EST5EDT
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt-get -qq update && \
	apt-get install -y build-essential pkg-config software-properties-common

ARG build_env=PROD

WORKDIR /opt/chess-ui-server
COPY ./ui ./

RUN npm install
RUN npm run build

EXPOSE 59200

# Build and start the server.
CMD ["npm", "start"]

