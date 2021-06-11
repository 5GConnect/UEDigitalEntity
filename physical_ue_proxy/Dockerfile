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
    cd UERANSIM && git checkout tags/v3.2.0 && \
    make -j`nproc`

# Build final image
FROM ubuntu:bionic

ENV DEBIAN_FRONTEND=noninteractive

COPY --from=builder /UERANSIM/build /UERANSIM/build
COPY --from=builder /UERANSIM/config /UERANSIM/config

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        libsctp-dev \
        lksctp-tools \
        iproute2 \
        iptables \
        netbase \
        ifupdown \
        net-tools \
        iputils-ping && \
    apt-get autoremove -y && apt-get autoclean

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY requirements.txt /usr/src/app/

#RUN apk add --update --no-cache gcc musl-dev bash
#RUN  apt-get install python3.6 -y
RUN apt update
RUN apt-get install python3-pip -y
RUN pip3 install --no-cache-dir -r requirements.txt

COPY . /usr/src/app

#EXPOSE 8082

ENTRYPOINT ["python3"]

CMD ["-m", "server"]
