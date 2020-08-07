#!/bin/bash

# Stolen from https://gist.github.com/judy2k/7656bfe3b322d669ef75364a46327836
read_var() {
    VAR=$(grep $1 $2 | xargs)
    IFS="=" read -ra VAR <<< "$VAR"
    echo ${VAR[1]}
}

BLOG_SERVER=$(read_var BLOG_SERVER .env)

echo "Rsyncing traefik..."

ssh $BLOG_SERVER << EOF
  mkdir -p ~/traefik
EOF

rsync -r -v ./traefik $BLOG_SERVER:~

echo "Restarting Traefik on server..."

ssh $BLOG_SERVER << EOF
  cd ~/traefik
  docker-compose down
  docker-compose up -d
EOF