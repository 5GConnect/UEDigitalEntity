FROM ubuntu:bionic as builder

ENV DEBIAN_FRONTEND=noninteractive

# Install updates and dependencies
RUN apt-get update && \
    apt-get -y install \
        make \
        g++ \
        libsctp-dev \
        lksctp-tools \
        git \
        vim \
        iproute2 \
        iptables \
        net-tools \
        ifupdown \
        iputils-ping \
        wget \
        libssl-dev

RUN version=3.20 && \
    build=0 && \
    mkdir ~/temp && \
    cd ~/temp && \
    wget https://cmake.org/files/v$version/cmake-$version.$build.tar.gz && \
    tar -xzvf cmake-$version.$build.tar.gz && \
    cd cmake-$version.$build/ && \
    ./bootstrap && \
    make -j`nproc` && \
    make install && ldconfig && \
    cmake --version

# Clone and build UERANSIM
RUN git clone https://github.com/aligungr/UERANSIM && \
    cd UERANSIM && git checkout tags/v3.1.9 && \
    make -j`nproc`

FROM python:3.6-alpine

COPY --from=builder /UERANSIM/build /UERANSIM/build

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY requirements.txt /usr/src/app/

RUN pip3 install --no-cache-dir -r requirements.txt

COPY . /usr/src/app

#EXPOSE 8082

ENTRYPOINT ["python3"]

CMD ["-m", "swagger_server"]
