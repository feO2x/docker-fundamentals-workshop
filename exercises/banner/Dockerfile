FROM ubuntu:24.04
RUN apt-get update \
    && apt-get install -y --no-install-recommends figlet \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --chmod=755 banner.sh .
ENV SCHRIFT=standard
ENTRYPOINT ["./banner.sh"]
CMD ["Moin"]
