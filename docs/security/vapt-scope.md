# VAPT scope — for an independent security tester

This document is what to hand an external penetration-testing vendor. It does **not** replace independent testing — everything in the P0/P1 code changes this pass has been verified by this project's own automated and manual testing, not by a third party, and that's exactly the gap an external VAPT closes.

## In scope

1. **Web application** — `https://ghar-doc-app.onrender.com` (React SPA)
2. **REST API** — `https://ghar-doc-api.onrender.com/api/*` (NestJS)
3. **Android application** — the EAS-built APK (`apps/mobile`), most recent build link available from the project owner
4. **Authentication** — login, signup (patient/doctor), refresh rotation, logout, the progressive-lockout mechanism, refresh-token-family reuse detection (all shipped this pass — genuinely new attack surface worth focused testing, not just re-confirming old behavior)
5. **Authorization** — every role-gated endpoint (`PATIENT`/`DOCTOR`/`ADMIN`), specifically:
   - `GET /visits`, `GET /visits/mine`, `GET /visits/assigned`, `GET /visits/:id`
   - `PATCH /visits/:id/assign`, `PATCH /visits/:id/status`, `PATCH /visits/:id/cancel`
   - `GET /doctors`, `GET /doctors/:id/status-history`, `PATCH /doctors/:id/status`, `PATCH /doctors/me/availability`
   - `GET /users/me`, `PATCH /users/me`
6. **IDOR/BOLA** — every by-ID endpoint above, with a focus on cross-tenant access (patient A vs. patient B, doctor A vs. doctor B)
7. **Admin panel** (the web app's `/admin/*` routes) — doctor approval workflow, safety dashboard, all-visits view
8. **Business logic** — the visit lifecycle state machine (`packages/shared/src/visit-transitions.ts`), the triage safety-classification engine (`packages/shared/src/triage-rules.ts` — specifically, attempt to tamper with or bypass the server-side RED-flag classification; the client never sends a `priority` field, confirm this can't be smuggled in)
9. **Dispatch/concurrency** — the visit-assignment race-condition fix shipped this pass (`VisitsService.transition()`'s conditional `updateMany`); attempt genuine concurrent-request races against `PATCH /visits/:id/assign` and the other transition endpoints
10. **Cloud configuration review** — Render service configuration (`render.yaml`), environment variable exposure, CORS/security-header configuration (`apps/api/src/main.ts`)
11. **Database security review** — Neon connection security, credential scope; **cannot be done from code alone**, needs direct Neon dashboard access
12. **Payment testing** — **not applicable yet**. Razorpay integration exists only as paused, uncommitted, unwired code (`apps/api/src/payments/`) — it is not deployed and has no live endpoint. Re-scope this section if/when that work resumes.

## Out of scope

- **Denial-of-service / load testing** against the live Render free-tier instance — would degrade real service and isn't useful against a single-instance free-tier deployment sized for testing, not production load.
- **Social engineering / phishing** against the project owner or any real account holder.
- **Destructive testing against real patient data** — there is no real patient data in this system yet (no real-patient launch has happened); use the seeded/disposable test account matrix below for everything.
- **iOS testing** — no iOS app exists; add this section back if one is built.

## Test account matrix

Use only disposable, clearly-labeled test accounts — never real user data. The existing seeded accounts (password `Password@123` for all) are a starting point:

| Role | Email | Notes |
|---|---|---|
| Patient | `patient@ghardoc.com` | Seeded, safe to use for any patient-side test |
| Doctor (approved) | `doctor@ghardoc.com` | Seeded, `APPROVED` status |
| Doctor (pending) | `pending.doctor@ghardoc.com` | Seeded, `PENDING` status — useful for testing the approval-gate on assignment |
| Admin | `admin@ghardoc.com` | Seeded |

For any test requiring additional accounts (multi-patient IDOR checks, concurrency races), create new accounts via `/api/auth/signup/patient` or `/api/auth/signup/doctor` with a clearly test-labeled email (e.g. `vapt-test-<label>@example.com`) so they're easy to identify and clean up afterward — the same disposable-fixture pattern this project's own `apps/api/test/helpers.ts` uses for automated tests.

## What this project's own testing already covers (context for the tester, not a substitute)

- 15 automated e2e tests (`apps/api/test/`) covering login brute-force protection, refresh-token reuse/family-kill, visit-assignment concurrency (a real fired-simultaneously race, not simulated), core IDOR checks, security headers, CORS, and body-size limits — run against the real database, not mocks.
- Manual live-endpoint verification against the deployed production API for every change this pass.

An external tester should treat all of the above as a starting hypothesis to independently verify, not as ground truth.
