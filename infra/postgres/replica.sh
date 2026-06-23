#!/bin/bash
set -e

if [ ! -f "$PGDATA/PG_VERSION" ]; then
  echo "Aguardando primary em postgres-write..."
  until pg_isready -h postgres-write -U root; do
    sleep 2
  done

  pg_basebackup \
    -h postgres-write \
    -U replicator \
    -D "$PGDATA" \
    -P -Xs -R

  chmod 0700 "$PGDATA"
fi

exec postgres -D "$PGDATA"
