# GharDoc security hardening — final report

Covers the P0 and P1–P2 passes completed against the original 35-section security brief. P3 documentation (this file plus `backup-strategy.md`, `incident-response.md`, `privacy-data-inventory.md`, `vapt-scope.md`) is complete; a small number of items remain genuinely outside what this session can verify or decide unilaterally — flagged explicitly below rather than assumed done.

## A. Executive summary

GharDoc's authentication, authorization, and dispatch-concurrency layers have been hardened against every P0/P1 finding from the original audit that was actually fixable in code, verified with 15 new automated end-to-end tests run against the real database (not mocks), and confirmed live in production. A CI pipeline now runs on every push, including the same e2e suite against an ephemeral database. Two real bugs were found and fixed *by the new tests themselves* during this pass (a mishandled `PayloadTooLargeError`, and `express` used as an undeclared transitive dependency that would have broken the next Render deploy) — direct evidence the verification approach is doing real work, not rubber-stamping.

**This is not a claim of complete security.** No independent penetration test has been performed. Several items require the user's direct action (Neon dashboard verification, Sentry account setup, legal review, external VAPT) and are listed explicitly in sections K–M.

## B. Security architecture

Unchanged at the architectural level, as instructed — NestJS + Prisma + PostgreSQL (Neon) + React (web) + Expo (mobile), JWT access tokens, rotating hashed refresh tokens, three roles (PATIENT/DOCTOR/ADMIN) enforced via guards + per-method ownership checks. What's new this pass:
- A `familyId` lineage on `RefreshToken`, enabling reuse detection.
- Progressive, temporary account lockout on `User` (`failedLoginAttempts`/`lockedUntil`).
- Conditional (status-guarded) updates replacing plain updates on `Visit` transitions — closes a race window, not a new architectural layer.
- `helmet` + explicit CORS + explicit body-size limits at the HTTP boundary (`main.ts`).
- `@sentry/node`, inert unless `SENTRY_DSN` is set.
- `ipAddress`/`userAgent` columns on the two audit-event tables.

## C. Changes made

**P0** (commit `fe14f28`): per-IP + per-account login rate limiting/progressive lockout, constant-time dummy-hash comparison to close a timing-based enumeration side-channel, refresh-token-family reuse detection, visit-assignment/status/cancel race-condition fix (status-guarded conditional update), `trust proxy` so per-IP limiting sees real client IPs behind Render's proxy.

**P1–P2** (commit `b7835ea`, plus CI-only follow-up commits `3bc3534`/`1eb0a99`/`93188db`/`a5f62b2`): `helmet` (CSP disabled — this is a JSON API, not browser-rendered), explicit CORS methods/headers, explicit 256KB body-size limit, audit-log IP/user-agent capture on doctor-status and visit-status events, `HttpExceptionFilter` now logs real 500s server-side and forwards to Sentry when configured, JWT secret validation tightened from `.min(1)` to `.min(32)`, `User.mfaEnabled`/`mfaSecret` reserved (unused) for a future TOTP implementation, mobile `axios` widened from an exact vulnerable pin to a safe caret range, new GitHub Actions CI pipeline, five new P1-verification e2e tests.

**Bugs found and fixed by the new tests, not assumed away:**
- `HttpExceptionFilter` was flattening every non-`HttpException` error into a generic 500 — including `PayloadTooLargeError`, which carries its own real `413` status. Real users hitting the new body-size limit would have seen an incorrect, unhelpfully generic error. Fixed to respect a raw error's own status code.
- `main.ts` imported `express` directly for the new body-parser config, but it was only ever a *transitive* dependency via `@nestjs/platform-express` — pnpm's strict linking doesn't expose that for direct import. Would have broken the next Render deploy (`Cannot find module 'express'`) had it not been caught by actually booting the compiled build before pushing, not just `tsc --noEmit`.
- The CORS test's own premise was wrong, not the app: a static-string CORS origin always emits that value regardless of the request's `Origin` header — this is correct/secure behavior (a browser on an attacker's origin still can't read the response, since the header value doesn't match its own origin), not a bug. Test assertion corrected rather than changing working app code.

## D. Files changed

`apps/api/src/{auth,visits,doctors}/*.service.ts`, `*.controller.ts`, `main.ts`, `common/filters/http-exception.filter.ts`, `common/types/request-context.ts` (new), `config/env.validation.ts`, `apps/api/prisma/schema.prisma`, two hand-written migrations, `apps/api/test/*` (5 new spec files + shared `setup.ts`/`helpers.ts`), `apps/mobile/package.json`, `.github/workflows/ci.yml` (new), `docs/security/*.md` (new, this file included). Full detail in the two feature commits' messages (`fe14f28`, `b7835ea`).

## E. Database changes

Two additive, hand-written migrations (Prisma's interactive migration flow doesn't run in this project's shell — the established workaround throughout this whole build):
- `20260821090337_login_backoff_and_refresh_families`: `User.failedLoginAttempts`/`lockedUntil`, `RefreshToken.familyId` + index. Backfilled all 95 pre-existing `RefreshToken` rows (`familyId = id`, each becoming a family of one) — verified zero mismatches after backfill.
- `20260821095415_audit_log_context_and_mfa_ready`: `User.mfaEnabled`/`mfaSecret`, `DoctorStatusEvent`/`VisitStatusEvent` gain `ipAddress`/`userAgent`.

Both applied to the real database and confirmed against live data before deploying the corresponding code.

## F. Dependencies changed

`@nestjs/throttler`, `helmet`, `@sentry/node`, `express` (promoted from transitive to explicit — see bug list above) added to `apps/api`; `jest`/`supertest`/`@nestjs/testing`/`ts-jest` added as dev dependencies. `apps/mobile`'s `axios` widened from an exact `1.7.7` pin to `^1.7.7`, resolving to patched `1.19.0`.

**Measured effect**: `pnpm audit --prod` went from **49 findings (2 low, 27 moderate, 20 high)** before this pass to **20 findings (1 low, 12 moderate, 7 high)** after — confirmed by direct re-run, not assumed. The remaining 7 highs are all in `multer` (4 — pulled in by `@nestjs/platform-express`, but this app has zero file-upload routes, so the vulnerable code path is never reachable), `lodash` (1 — `@nestjs/config`'s internal dependency; the vulnerable function is `_.template()`, which `@nestjs/config` never calls), and `image-size` (2 — Expo/Metro's build-time bundler tooling, never shipped in the actual mobile app binary). Verified via `pnpm why` that each traces to exactly the dependency path claimed, not assumed.

## G. Tests created

`apps/api/test/`: `auth-backoff.e2e-spec.ts` (4 tests), `auth-refresh-reuse.e2e-spec.ts` (2 tests), `visits-authorization.e2e-spec.ts` (4 tests), `p1-hardening.e2e-spec.ts` (5 tests) — 15 total. Jest + Supertest, run against the real dev database with disposable, uniquely-prefixed fixtures cleaned up in `afterAll`/`afterEach` (verified zero stray rows left behind after every run this pass, including after a run that timed out and had to be manually cleaned once).

## H. Test results

All 15 pass locally against the real database. The same suite now runs in CI (`.github/workflows/ci.yml`) against an ephemeral GitHub Actions Postgres service container — **confirmed green** as of run `32473545444` (all three jobs: secret scan, typecheck/build/audit, e2e tests). Getting CI green took five iterations, each a genuine, verified root cause rather than a guess accepted on faith:
1. `actions/setup-node`'s built-in pnpm cache failed — removed (optimization, not correctness).
2. `pnpm install --frozen-lockfile` failed — narrowed to plain `pnpm install` also failing, ruling out a lockfile-specific cause.
3. Root cause found (only after installing and authenticating `gh` CLI mid-session, since the anonymous GitHub REST API kept 403ing on log downloads): **pnpm 11.x itself requires Node ≥ 22.13 to run** (it uses the `node:sqlite` builtin internally) — unrelated to what Node version the app needs. Fixed by pinning CI's tooling Node to 22, explicitly decoupled from `.node-version` (which stays at 20, what Render actually runs).
4. With that fixed, a real new failure appeared: `tsc --noEmit` ran before `prisma generate` in CI's fresh checkout, so generated Prisma types didn't exist yet, cascading into missing-property and implicitly-any errors. **Reproduced locally** (temporarily removed the generated Prisma client, got the identical error pattern, restored it, confirmed clean) before trusting the fix. Added explicit `prisma generate` steps.

## I. Security findings closed

| Finding | Severity | Before | Fix | Evidence |
|---|---|---|---|---|
| No login rate limiting | Critical | Unlimited attempts | Per-IP (10/min) + progressive account lockout (5→1min, 10→5min, 15→15min) | e2e test + live curl trip to 429 in production |
| No account lockout | Critical | N/A | Temporary, escalating, never permanent | e2e test asserting lock + reset-on-success |
| No refresh-token reuse detection | Critical | Stolen token usable until natural expiry (up to 30d) | Family-kill on replay of an already-rotated token | e2e test: replaying a rotated token kills the *current* token too |
| Visit-assignment race condition | High (found this pass, not in original audit) | Two concurrent requests could silently overwrite each other | Status-guarded conditional update, loser gets 409 | e2e test firing two genuinely concurrent requests, asserting exactly one 200 |
| Login timing-based enumeration | Medium | Nonexistent/inactive/locked accounts returned near-instantly vs. real accounts | Constant-cost dummy bcrypt compare on every short-circuit branch | Code review; not independently timing-measured this pass — flagged, not overclaimed |
| No security headers | High | None | `helmet`, JSON-API-appropriate config | e2e test + live header check |
| Loose CORS | Low (already mostly correct) | No wildcard, but implicit methods/headers | Explicit allow-list | e2e test |
| Unhandled 500s invisible | Medium (found this pass) | No server-side trace of real errors | `Logger.error` + Sentry hook | Code review |
| Mishandled non-HttpException errors | Medium (found this pass) | `PayloadTooLargeError` etc. flattened to generic 500 | Respects raw error's own status | e2e test |
| Weak JWT secret validation | Low | `.min(1)` | `.min(32)` | Code review |
| `axios` known-vulnerable pin (mobile) | High | Exact `1.7.7` | `^1.7.7` → resolves `1.19.0` | `pnpm audit --prod` before/after |
| No admin action audit context | Low | `changedById` only | + `ipAddress`/`userAgent` | e2e test |
| No CI/CD | Medium | None | Typecheck, build, tests, audit, secret scan on every push | Live GitHub Actions run, green |
| No structured security logging | Low | Bare console usage | Contextual `Logger` at every security-relevant event | Code review |

## J. Security findings remaining

- **Signup email enumeration** (`ConflictException` on duplicate signup) — deliberately left as-is; standard, usability-driven tradeoff, not overlooked (see `auth.service.ts`'s `assertEmailFree`).
- **`assign()`'s doctor-approval check reads outside the transition's CAS window** — a doctor suspended in the exact instant between that check and the write isn't caught. Accepted residual risk, very low probability, documented rather than silently assumed fixed.
- **Multer/lodash/image-size** dependency advisories — documented accepted risk (see section F), not force-fixed.
- **No ESLint/lint tooling** — genuinely absent from this repo; deliberately not introduced this pass (see `AskUserQuestion` decision — real scope beyond "add a CI step," would surface unrelated pre-existing violations needing triage).
- **Privacy Policy drift** — the live policy says structured symptom checklists aren't offered; the triage system built earlier in this project contradicts that. Documented in `privacy-data-inventory.md`, not silently fixed (it's a public legal document; editing it deserves its own deliberate pass).

## K. Cloud settings requiring manual verification

Cannot be confirmed from code — needs direct dashboard access this session doesn't have:
- [ ] Neon: actual point-in-time-recovery window for the current plan, and whether it's enabled.
- [ ] Neon: a real, supervised restore test (branch from a point in time, verify completeness, discard).
- [ ] Render: log retention period for the current plan.
- [ ] Sentry: no account exists yet — the integration is wired and inert (`SENTRY_DSN` unset). Provide a DSN to activate; nothing further to build.

## L. Privacy/legal items requiring human review

- The Privacy Policy drift noted in section J — needs a content update to honestly describe structured symptom/triage data collection and caregiver-booking fields.
- Data retention schedule — the Privacy Policy itself already flags this as undefined; still true.
- User-notification obligations under a real incident — explicitly marked in `incident-response.md` as requiring legal confirmation, not answered by this pass.
- The Privacy Policy and Terms have never been reviewed by a lawyer (both documents already say so themselves) — unchanged by this pass.

## M. VAPT scope for external tester

See `docs/security/vapt-scope.md` for the full scope, out-of-scope list, and disposable test-account matrix. Summary: web app, REST API, Android app, authentication (including the new rate-limiting/reuse-detection mechanisms — genuinely new attack surface), authorization/IDOR across every role-gated endpoint, the triage safety-classification tamper-resistance, the visit-assignment concurrency fix, cloud configuration, and database security review. Payment testing explicitly out of scope — Razorpay integration remains paused, uncommitted, and unwired.

## N. Production go/no-go

**GO — ready for independent VAPT**, subject to the remaining external, infrastructure, and regulatory checks listed in sections K and L.

Not "GharDoc is completely secure." The P0/P1 code-level findings that were fixable in code are fixed and verified — live, automated, and reproducible, not just asserted. What's left is exactly what no amount of self-review can close: independent adversarial testing, cloud-provider-side verification this session has no access to, and legal review of a public-facing document. Those are the honest boundaries of what a single hardening pass, however thorough, can actually establish.
