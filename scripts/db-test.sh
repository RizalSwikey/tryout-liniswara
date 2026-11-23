#!/usr/bin/env bash
# Jalankan migrasi + uji RLS/RPC di Postgres lokal (tanpa Docker/Supabase CLI).
# Pakai: PGHOST=127.0.0.1 PGPORT=55432 PGUSER=postgres ./scripts/db-test.sh
set -euo pipefail

PSQL="${PSQL:-psql}"
DB="${DB:-linis_test}"
CONN=(-h "${PGHOST:-127.0.0.1}" -p "${PGPORT:-55432}" -U "${PGUSER:-postgres}" -w -v ON_ERROR_STOP=1)

echo "== reset database $DB"
"$PSQL" "${CONN[@]}" -d postgres -q -c "drop database if exists $DB with (force);" -c "create database $DB;" < /dev/null

echo "== auth shim"
"$PSQL" "${CONN[@]}" -d "$DB" -q -f supabase/tests/000_auth_shim.sql < /dev/null

echo "== migrasi"
for f in supabase/migrations/*.sql; do
  echo "   $f"
  "$PSQL" "${CONN[@]}" -d "$DB" -q -f "$f" < /dev/null
done

echo "== uji RLS + RPC"
"$PSQL" "${CONN[@]}" -d "$DB" -q -At -f supabase/tests/001_policies.sql < /dev/null 2>&1 | grep -vE "^[A-Za-z0-9_]+$|^-+$|^\(1 row\)$|^$"
