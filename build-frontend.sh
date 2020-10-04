#!/bin/bash

# Stolen from https://gist.github.com/judy2k/7656bfe3b322d669ef75364a46327836
read_var() {
    VAR=$(grep $1 $2 | xargs)
    IFS="=" read -ra VAR <<< "$VAR"
    echo ${VAR[1]}
}

DOCKER_EXTERNAL_REPO=$(read_var DOCKER_EXTERNAL_REPO .env)
DOCKER_BACKEND_IMAGE=$(read_var DOCKER_BACKEND_IMAGE .env)
DOCKER_FRONTEND_IMAGE=$(read_var DOCKER_FRONTEND_IMAGE .env)
DOCKER_IMAGE_VERSION=$(read_var DOCKER_IMAGE_VERSION .env)

(docker build -t $DOCKER_FRONTEND_IMAGE:$DOCKER_IMAGE_VERSION -t $DOCKER_FRONTEND_IMAGE:latest -t $DOCKER_EXTERNAL_REPO/$DOCKER_FRONTEND_IMAGE:$DOCKER_IMAGE_VERSION -t $DOCKER_EXTERNAL_REPO/$DOCKER_FRONTEND_IMAGE:latest -f frontend/Dockerfile .)
