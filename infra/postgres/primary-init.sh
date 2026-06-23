#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" <<-EOSQL
  CREATE ROLE replicator WITH REPLICATION LOGIN PASSWORD 'replicatorpassword';
EOSQL

echo "host replication replicator all md5" >> "$PGDATA/pg_hba.conf"

cat >> "$PGDATA/postgresql.conf" <<EOF
wal_level = replica
max_wal_senders = 5
wal_keep_size = 64
hot_standby = on
EOF
