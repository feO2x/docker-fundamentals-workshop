FROM ubuntu:24.04
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl jq ca-certificates \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --chmod=755 wetter.sh .
ENV EINHEIT=celsius
USER ubuntu
ENTRYPOINT ["./wetter.sh"]
CMD ["Regensburg"]
