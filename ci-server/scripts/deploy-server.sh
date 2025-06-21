#!/bin/bash

docker-compose -f ../server/docker-compose.yaml pull server
docker-compose -f ../server/docker-compose.yaml up -d