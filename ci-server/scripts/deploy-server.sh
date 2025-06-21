#!/bin/bash

docker-compose -f docker-compose.server.yaml pull server
docker-compose -f docker-compose.server.yaml up -d