#!/bin/bash

set -euo pipefail

DB_CONTAINER="${DB_CONTAINER:-postgresql}"
DB_NAME="${DB_NAME:-postgres}"
DB_USER="${DB_USER:-admin}"
DB_PASSWORD="${DB_PASSWORD:-admin_password}"

GROUP_CODE="${GROUP_CODE:-}"
COUNT="${COUNT:-5}"
SESSION_ID="${SESSION_ID:-}"

usage() {
    echo "Usage: GROUP_CODE=<code> [SESSION_ID=<uuid>] [COUNT=<n>] $0"
    echo ""
    echo "Environment variables:"
    echo "  GROUP_CODE    Required. Programme group code, e.g. XYZ1234"
    echo "  SESSION_ID    Optional. Session to add attendees to"
    echo "  COUNT         Optional. New referrals to add to the group first (default: 5)"
    echo ""
    echo "Optional DB overrides:"
    echo "  DB_CONTAINER  Docker container name (default: postgresql)"
    echo "  DB_NAME       Database name (default: postgres)"
    echo "  DB_USER       Database user (default: admin)"
    echo "  DB_PASSWORD   Database password (default: admin_password)"
    echo ""
    echo "Examples:"
    echo "  GROUP_CODE=XYZ1234 SESSION_ID=c6d4f4c8-b472-4df6-bf9d-197109891d27 $0"
    echo "  GROUP_CODE=XYZ1234 COUNT=10 $0"
}

psql_exec() {
    docker exec -e PGPASSWORD="$DB_PASSWORD" "$DB_CONTAINER" \
        psql -v ON_ERROR_STOP=1 -U "$DB_USER" -d "$DB_NAME" -c "$1"
}

psql_value() {
    docker exec -e PGPASSWORD="$DB_PASSWORD" "$DB_CONTAINER" \
        psql -v ON_ERROR_STOP=1 -t -A -U "$DB_USER" -d "$DB_NAME" -c "$1" | tr -d '[:space:]'
}

if [[ -z "$GROUP_CODE" ]]; then
    usage
    exit 1
fi

echo "== Current counts =="
psql_exec "SELECT COUNT(*) AS groups_count FROM programme_group;"
psql_exec "SELECT COUNT(*) AS sessions_count FROM session;"

echo ""
echo "== Latest programme groups =="
psql_exec "SELECT id, code FROM programme_group ORDER BY created_at DESC LIMIT 10;"

GROUP_ID="$(psql_value "SELECT id FROM programme_group WHERE code='${GROUP_CODE}' LIMIT 1;")"

if [[ -z "$GROUP_ID" ]]; then
    echo "No programme_group found for GROUP_CODE=${GROUP_CODE}" >&2
    exit 1
fi

if [[ -z "$SESSION_ID" ]]; then
    SESSION_ID="$(psql_value "SELECT id FROM session WHERE programme_group_id='${GROUP_ID}'::uuid ORDER BY starts_at LIMIT 1;")"
fi

if [[ -z "$SESSION_ID" ]]; then
    echo "No session found for GROUP_ID=${GROUP_ID}" >&2
    exit 1
fi

echo ""
echo "== Target group =="
psql_exec "SELECT id, code FROM programme_group WHERE id='${GROUP_ID}'::uuid;"

echo ""
echo "== Target session =="
psql_exec "SELECT id, programme_group_id, starts_at FROM session WHERE id='${SESSION_ID}'::uuid;"

echo ""
echo "== Current attendee count before insert =="
psql_exec "SELECT COUNT(*) AS current_attendees FROM attendee WHERE session_id='${SESSION_ID}'::uuid;"

echo ""
echo "== Insert new group members =="
psql_exec "
WITH candidates AS (
    SELECT r.id AS referral_id
    FROM referral r
    LEFT JOIN programme_group_membership pgm
        ON pgm.referral_id = r.id
       AND pgm.deleted_at IS NULL
    WHERE pgm.id IS NULL
    ORDER BY r.created_at DESC
    LIMIT ${COUNT}
),
inserted AS (
    INSERT INTO programme_group_membership (
        id,
        programme_group_id,
        referral_id,
        created_at,
        created_by_username
    )
    SELECT
        gen_random_uuid(),
        '${GROUP_ID}'::uuid,
        c.referral_id,
        NOW(),
        'REFER_MONITOR_PP'
    FROM candidates c
    RETURNING referral_id
)
SELECT COUNT(*) AS inserted_group_members
FROM inserted;
"

echo ""
echo "== Insert missing attendees for target session =="
psql_exec "
WITH target_members AS (
    SELECT pgm.referral_id
    FROM programme_group_membership pgm
    WHERE pgm.programme_group_id = '${GROUP_ID}'::uuid
      AND pgm.deleted_at IS NULL
),
to_insert AS (
    SELECT tm.referral_id
    FROM target_members tm
    LEFT JOIN attendee a
        ON a.session_id = '${SESSION_ID}'::uuid
       AND a.referral_id = tm.referral_id
    WHERE a.id IS NULL
),
inserted AS (
    INSERT INTO attendee (
        id,
        referral_id,
        session_id
    )
    SELECT
        gen_random_uuid(),
        ti.referral_id,
        '${SESSION_ID}'::uuid
    FROM to_insert ti
    RETURNING referral_id
)
SELECT COUNT(*) AS inserted_attendees
FROM inserted;
"

echo ""
echo "== Final attendees for session =="
psql_exec "
SELECT r.person_name, r.crn
FROM attendee a
JOIN referral r
    ON r.id = a.referral_id
WHERE a.session_id = '${SESSION_ID}'::uuid
ORDER BY r.person_name;
"

echo ""
echo "GROUP_CODE=${GROUP_CODE}"
echo "GROUP_ID=${GROUP_ID}"
echo "SESSION_ID=${SESSION_ID}"