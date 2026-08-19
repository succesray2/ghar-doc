# Ghar Doc

A platform for doctor home visits: patients request a visit, an admin/dispatcher assigns an approved doctor, and the doctor walks the visit through to completion — all tracked in real time.

This is the **foundation build**: authentication for all three roles (Patient, Doctor, Admin) and the core visit lifecycle (`REQUESTED → ASSIGNED → EN_ROUTE → IN_PROGRESS → COMPLETED`, with cancellation), end-to-end through a real web UI. Scheduling, medical records, payments, live GPS tracking, and the mobile app are deliberately not built yet — see [Roadmap](#roadmap).

## Apps

- **`apps/api`** — NestJS + Prisma + PostgreSQL backend. JWT auth (short-lived access token + rotating httpOnly-cookie refresh token). Runs at http://localhost:4000/api
- **`apps/web`** — the authenticated product: patient/doctor/admin dashboards. React + Vite + TypeScript, React Router, TanStack Query, Zustand, Tailwind CSS. Runs at http://localhost:5173
- **`apps/marketing`** — the public marketing website (home, services, about, contact). Plain React + Vite + Tailwind, no backend dependency — its "Book a Visit" and "Sign in" buttons link out to `apps/web`. Runs at http://localhost:5174. **All of its city/contact/founder/testimonial content is placeholder** — see `apps/marketing/src/data/content.ts`, the one file to edit before launch.
- **`packages/shared`** — Zod schemas, enums, and DTO types used by both `api` and `web` (and importable unchanged by a future mobile app). Not used by `marketing`, which has no API calls.

## First-time setup

### 1. Get a database

This project uses a free [Neon](https://neon.tech) PostgreSQL database (no local install needed):

1. Create a free account at neon.tech and create a new project.
2. Copy the connection string it gives you (starts with `postgresql://...?sslmode=require`).
3. Paste it into `apps/api/.env` as `DATABASE_URL`.

### 2. Install and initialize

```powershell
pnpm install
pnpm --filter @ghar-doc/shared build
pnpm db:migrate
pnpm db:seed
```

`db:seed` creates three accounts, all sharing one password (`Password@123`, overridable via `SEED_PASSWORD` in `apps/api/.env`):

| Role    | Email               |
|---------|---------------------|
| Admin   | admin@ghardoc.com   |
| Doctor  | doctor@ghardoc.com  |
| Patient | patient@ghardoc.com |

### 3. Run it

```powershell
pnpm dev
```

- API: http://localhost:4000/api
- Web (dashboard app): http://localhost:5173
- Marketing site: http://localhost:5174

## Everyday workflow

```powershell
pnpm dev
```

That's it — the API, the dashboard app, and the marketing site all run together via Turborepo. The marketing site works standalone (no database needed) since it has no backend calls of its own.

## Try the golden path

1. Log in as `patient@ghardoc.com` → **Request a Visit** → submit.
2. Log in as `admin@ghardoc.com` → see the request → **Assign doctor** → pick the seeded doctor.
3. Log in as `doctor@ghardoc.com` → walk the visit through *Mark en route → Mark arrived/start → Mark completed*.
4. Back as the patient, watch the status update (the page polls every ~8s).

Inspect the database directly any time with:

```powershell
pnpm db:studio
```

## Roadmap

Not built yet, but the data model and API already leave room for each without rework:

1. Doctor scheduling/availability (replaces the simple `isAvailable` flag)
2. Medical records & prescriptions
3. Payments (the `paymentStatus` field already exists on `Visit`)
4. Real-time tracking (WebSocket push instead of polling)
5. Mobile app (Expo/React Native, reusing `packages/shared` directly)
6. Notifications (email/SMS/push, driven off the `VisitStatusEvent` audit trail)
7. Admin analytics dashboard
8. Automated testing & CI/CD
