# syntax=docker/dockerfile:1

FROM python:3.9-alpine

WORKDIR /src

COPY requirements.txt .

RUN \
    apk add --no-cache postgresql-libs && \
    apk add --no-cache --virtual .build-deps gcc musl-dev postgresql-dev && \
    apk add build-base linux-headers && \
    python3 -m pip install -r requirements.txt --no-cache-dir && \
    apk --purge del .build-deps

RUN mkdir src
COPY /src .

EXPOSE 8000