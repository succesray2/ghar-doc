# Backup strategy

## What's true today (verified from code/config)

- The database is a single managed Postgres instance on **Neon** (`ep-square-wildflower-axo5ks5f-pooler.c-4.us-east-2.aws.neon.tech`), referenced via `DATABASE_URL` in `apps/api/.env` (local, gitignored) and as a `sync: false` Render env var in production — the same Neon project is used for both local development and the deployed API. There is no separate staging/production database today.
- **No application-level backup job exists anywhere in this codebase.** There is no scheduled export script, no `pg_dump` cron, no S3/object-storage upload step. Whatever backup protection exists is entirely whatever Neon provides at the infrastructure level for the plan this project is on.
- Migrations are the only "recovery" mechanism verified in-repo: every schema change is a hand-written, additive `apps/api/prisma/migrations/*/migration.sql` file, applied via `prisma migrate deploy`. This protects against *schema* mistakes (you can always redeploy from migration history) but does nothing for *data* loss.

## Verified from the Neon dashboard (2026-08-21)

- **History retention: 6 hours.** This is Neon's point-in-time-recovery (PITR) window for this project — you can restore/branch to any point within the last 6 hours; anything older is not recoverable through Neon's built-in mechanism at all. Confirmed via the project's own Settings page ("Project settings" → "History retention").
- Region: AWS US East 2 (Ohio). Postgres version 18. One branch (`production`, default) — the restore-via-branching workflow has never been used.
- This is almost certainly a **Free-tier limit**, not a deliberate choice — Neon's paid tiers (Launch and above) offer configurable retention up to 7+ days.

**Why 6 hours is a real risk, not just a number**: there is no monitoring/alerting today that would reliably surface data corruption, an accidental delete, or a bad migration within a 6-hour window (Sentry now catches unhandled application errors, but wouldn't catch e.g. an admin fat-fingering a destructive query directly). If a real data-loss event isn't caught inside that window, it's gone.

## What must actually be done before this is a real strategy

1. **Widen the recovery window.** Two options, not mutually exclusive:
   - Upgrade the Neon plan for longer built-in PITR retention (the simplest fix, ongoing cost).
   - Add an independent backup — a scheduled `pg_dump` to an object store the user controls directly — so recovery doesn't depend on Neon's retention window *or* the Neon account's continued existence at all. Not built; a real decision for the user given the ongoing storage cost.
2. **Perform a real restore test**, now that the mechanism is confirmed to exist: branch from a recent point in time in the Neon dashboard, verify the branched data is complete and consistent, then discard the branch. This is a concrete, doable drill with the current setup — just needs to actually be run once.
3. **Write down the actual recovery procedure** once (1) and (2) are settled — a step-by-step "how do we actually get the database back," referencing whichever path was chosen.

## Bottom line

The recovery mechanism itself is confirmed to exist and work the way Postgres/Neon documentation describes — this is no longer an open question. What's unverified is whether **6 hours is an acceptable risk window** for this product, and no restore drill has actually been run yet. Both are real decisions/actions for the user, not blocked on more investigation.
