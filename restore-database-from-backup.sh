#!/bin/bash

# Stolen from https://gist.github.com/judy2k/7656bfe3b322d669ef75364a46327836
read_var() {
    VAR=$(grep "^$1=" $2 | xargs)
    IFS="=" read -ra VAR <<< "$VAR"
    echo ${VAR[1]}
}

POSTGRES_DB=$(read_var POSTGRES_DB .env.prod)

echo "--------------------------------------------------"
echo " Importing $1 to local $POSTGRES_DB..."
echo "--------------------------------------------------"

psql -U postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$POSTGRES_DB';"
psql -U postgres -c "drop database $POSTGRES_DB"
psql -U postgres -c "create database $POSTGRES_DB"
psql -U postgres $POSTGRES_DB < $1