# Incident response plan

This is a first version sized to GharDoc's actual current state: one operator (the founder/developer), no dedicated security team, no SOC, no 24/7 monitoring. It describes what's genuinely possible with the tools that exist today, not an idealized enterprise process.

## Detection

What can actually surface an incident today:

- **Application logs** (Render's log stream, `apps/api`'s NestJS `Logger` output). As of this pass, security-relevant events are logged with context: successful/failed logins, progressive lockouts, refresh-token reuse (a strong signal of a stolen token), doctor status changes, visit assignments — each tagged with the acting user and, for admin actions, IP/user-agent.
- **Sentry** (`@sentry/node`, wired but inactive until `SENTRY_DSN` is set — see `docs/security/security-audit-final-report.md` section K) — once active, captures unhandled 5xx errors and unusual crash patterns.
- **No automated alerting exists yet.** Nothing pages anyone. Detection today is manual — checking Render's log stream or (once activated) Sentry's dashboard. This is a real, acknowledged gap for a healthcare-adjacent product and should be revisited before real-patient scale.

## Who's responsible

Today: the account owner (`succesray2@gmail.com`), full stop — there is no team, no on-call rotation, no delegated access. If/when this grows, this section needs a real named owner and a backup.

## Immediate response steps

1. **Disable the affected account(s).** `User.isActive = false` (already an existing, enforced field — `AuthService.login()` rejects inactive users) stops a compromised account from logging in again. This can be done directly via a database update today; no admin UI exists for it yet.
2. **Revoke sessions.** The refresh-token-family mechanism (shipped this pass) means killing every `RefreshToken` row for a `userId` (`revokedAt = now()`) immediately invalidates every active session for that user, forcing re-authentication everywhere.
3. **Rotate secrets if compromise is suspected at the infrastructure level** (not just one user account) — `JWT_ACCESS_SECRET`/`JWT_REFRESH_SECRET` are Render-generated (`generateValue: true`); rotating them via the Render dashboard immediately invalidates every access token and every refresh token platform-wide (a blunt but effective full-platform logout).
4. **Isolate**, in this architecture, mostly means: put the API into a state where it stops accepting new writes if a data-integrity issue is suspected — there is no separate "maintenance mode" flag built; the fastest real lever is suspending the Render service itself from its dashboard.

## Evidence preservation

- Render's log retention is whatever the current plan provides — **not independently verified this session**; check the Render dashboard directly before assuming logs survive long enough to investigate.
- Database rows relevant to an incident (the affected `User`, their `RefreshToken` history, `VisitStatusEvent`/`DoctorStatusEvent` audit rows) should be exported (e.g. a targeted `SELECT` dump) before any remediation that might alter or delete them.

## User notification

**Whether and when affected users must be notified is a legal question, not an engineering one — marked here as requiring legal confirmation, not answered.** India's data-protection framework (DPDP Act) and any future jurisdictions GharDoc operates in may have specific breach-notification timelines and requirements; nothing in this document should be read as legal advice or as a substitute for that review.

## Closing an incident

1. Confirm root cause (not just symptom) — if it's a code vulnerability, the fix should ship with the same rigor as every other change in this codebase (real tests, verified against the real API before/after, not just "looks fixed").
2. Document what happened, even briefly — this file, or a dated addendum to it, is the natural place.
3. Re-run the relevant part of the automated test suite (`apps/api/test/`) plus a manual spot-check against the live deployed API, matching the verification pattern already established for every change in this project.
