FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        g++ \
        gcc \
        make \
        python3 \
        openjdk-21-jdk \
        time \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app