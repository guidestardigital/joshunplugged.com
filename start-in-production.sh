#!/bin/bash

docker system prune --all --force

# Run the docker compose
docker-compose pull
docker-compose down

# Blog and Postgres
docker-compose up -d --remove-orphans --force-recreate
