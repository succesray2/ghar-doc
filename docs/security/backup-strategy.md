# Backup strategy

## What's true today (verified from code/config)

- The database is a single managed Postgres instance on **Neon** (`ep-square-wildflower-axo5ks5f-pooler.c-4.us-east-2.aws.neon.tech`), referenced via `DATABASE_URL` in `apps/api/.env` (local, gitignored) and as a `sync: false` Render env var in production — the same Neon project is used for both local development and the deployed API. There is no separate staging/production database today.
- **No application-level backup job exists anywhere in this codebase.** There is no scheduled export script, no `pg_dump` cron, no S3/object-storage upload step. Whatever backup protection exists is entirely whatever Neon provides at the infrastructure level for the plan this project is on.
- Migrations are the only "recovery" mechanism verified in-repo: every schema change is a hand-written, additive `apps/api/prisma/migrations/*/migration.sql` file, applied via `prisma migrate deploy`. This protects against *schema* mistakes (you can always redeploy from migration history) but does nothing for *data* loss.

## What requires checking the actual Neon dashboard (not guessable from code)

Neon's backup/recovery capability depends on the specific plan (Free vs. paid tiers offer different point-in-time-recovery windows), and this session has no access to that dashboard. Before relying on Neon for disaster recovery, confirm directly in the Neon console:

- [ ] What plan is this project on, and what point-in-time-recovery (PITR) window does it include (Neon's free tier has historically offered a much shorter window than paid tiers)?
- [ ] Is PITR actually enabled for this specific project, or does it need to be turned on?
- [ ] What's the actual retention period in days/hours?
- [ ] Does the plan support branching from a point in time (Neon's usual restore mechanism) into a new branch you can then promote?

## What must actually be done before this is a real strategy

1. **Perform a real restore test.** A backup that has never been restored is not a tested backup — this is the brief's own explicit requirement, and it can't be satisfied from this session (would need either dashboard access or a deliberate, supervised drill: branch from a recent point in time in Neon, verify the branched data is complete and consistent, then discard the branch).
2. **Decide on an independent backup path**, not solely reliant on the hosting provider — e.g. a scheduled `pg_dump` to an object store the user controls directly, so recovery doesn't depend entirely on Neon's own continued availability/plan. Not built; a real decision for the user, since it has an ongoing storage cost.
3. **Write down the actual recovery procedure** once (1) and (2) are answered — right now there is no step-by-step "how do we actually get the database back" document, which is exactly the gap this file is meant to eventually close once the above is answered.

## Bottom line

Until the checklist above is completed, treat backup/recovery as **unverified**, not as a solved problem — the honest current state is "whatever Neon does by default for this plan," which has not been confirmed to be sufficient.
