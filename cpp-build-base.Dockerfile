FROM ubuntu:focal

ENV TZ=EST5EDT
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt-get -qq update && \
	apt-get install -y build-essential git cmake autoconf libtool pkg-config software-properties-common

RUN add-apt-repository ppa:ubuntu-toolchain-r/test -y
RUN apt-get -qq update && apt-get install -qy g++ gcc git wget

ARG DEBIAN_FRONTEND=noninteractive