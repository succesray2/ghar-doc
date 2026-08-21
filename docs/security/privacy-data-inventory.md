# Privacy data inventory

Built directly from the current Prisma schema (`apps/api/prisma/schema.prisma`) and the code paths that actually read/write each field — not from what the product is "supposed to" collect. Cross-checked against the live Privacy Policy (`apps/web/src/data/privacy.ts`, kept identical across web/mobile/marketing).

## Data table

| Data | Purpose | Where stored | Who can access | Retention | Third-party sharing |
|---|---|---|---|---|---|
| Email, name, phone, password hash | Account identity, login | `User` table, Neon Postgres (US) | Self; Admin (all); Doctor (only for a patient whose visit is assigned to them, via the visit response) | Indefinite while account active — no defined deletion schedule | None |
| Patient address (line1/2, city, state, postal code) | Where the doctor goes for the home visit | `PatientProfile` | Self; assigned Doctor only (via visit response); Admin | Indefinite while account active | None |
| `lat`/`lng`, `dateOfBirth`, `gender`, `emergencyContact` | *Reserved, unused* | `PatientProfile` columns exist but no code path (signup, profile update, visit request) ever reads or writes them | N/A — always NULL | N/A | None |
| Doctor license number, specialty, years experience, bio | Doctor verification/approval | `DoctorProfile` | Self; Admin (approval workflow) | Indefinite while account active | None |
| Reason for visit, notes (free text) | Context for the assigned doctor | `Visit.reasonForVisit`/`notes` | Self (patient); assigned Doctor; Admin | Indefinite | None |
| **Structured symptom/triage answers** — selected symptoms, duration, severity, associated-sign yes/no answers, body region, BP systolic/diastolic, temperature+unit, known-diabetes flag, free-text "other" | Server-side safety-priority classification (RED/ORANGE/GREEN dispatch signal — explicitly not a diagnosis) | `VisitTriage.answers` (raw, full JSON blob) + `Visit.priority` (derived) | **Raw answers**: Self (patient, own visit only), Admin. **Doctor-safe summary only** (priority + matched red-flag names + which symptoms were selected — never the full raw blob) is what `VisitsService.mapVisit()` actually returns to a doctor | Indefinite, never edited after creation (deliberate — a future rule-version change must never rewrite historical classifications) | None |
| Booking-for-someone-else fields — patient name/age/sex, caregiver name/phone | Family/caregiver booking mode | `Visit.patientName/patientAge/patientSex/caregiverName/caregiverPhone` | Same access as the parent Visit row (self, assigned doctor, admin) | Indefinite | None |
| Refresh tokens | Session persistence | `RefreshToken` (hashed, never the raw token) | Backend only, never exposed via any API response | Until expiry (30d) or revocation | None |
| Login/lockout/audit-event metadata — IP address, user-agent, timestamps | Security monitoring, admin accountability | `DoctorStatusEvent`/`VisitStatusEvent` (`ipAddress`/`userAgent`, added this pass); application logs (Render) | Admin (audit rows via API); operator only (raw logs) | Audit rows: indefinite. Logs: whatever Render's plan retains, not independently verified | Render (hosting provider, infrastructure-level only) |
| Application error data (once Sentry is activated) | Debugging crashes | Sentry, only if `SENTRY_DSN` is configured — currently inactive | Operator (Sentry account) | Sentry's own retention for the configured plan | Sentry, third-party — explicitly scrubbed of cookies/auth headers/request body/user object before send (`apps/api/src/main.ts`'s `beforeSend` hook) |

## Real drift found between the Privacy Policy and the actual product

**This needs the Privacy Policy updated — it is currently inaccurate about a real, shipped feature, not a hypothetical future one:**

1. **Section 2 ("Visit information")** states: *"This is free text you provide — we don't currently offer structured symptom checklists or medical-history forms."* This was true when written, but the symptom-triage system (20 categories, structured duration/severity/associated-signs/numeric-readings) shipped later in the same build and directly contradicts it. A patient reading the current policy would not learn that structured symptom data, including numeric health readings (blood pressure, temperature) and a "known diabetes" flag, is now collected and used to compute a safety-priority classification.
2. **Booking-for-someone-else fields** (caregiver name/phone, patient name/age/sex when booking isn't for yourself) aren't mentioned anywhere in the policy's data-collection sections.
3. **Section 24 ("Security incidents")** says no formally documented incident-response plan exists — as of this pass, `docs/security/incident-response.md` does exist. This is the opposite kind of drift (the policy understates what's now true) and should be updated to reflect it.

Everything else in the policy — no GPS collection, no payment processing, no analytics, no third-party trackers, US-region hosting via Render/Neon, httpOnly-cookie-only session handling, no self-serve deletion — remains accurate as of this pass; nothing else in the actual codebase contradicts it.

**Recommendation**: update `apps/web/src/data/privacy.ts` (and the identical copies in `apps/mobile`/`apps/marketing`) to describe the symptom-triage data collection honestly, using the same "not a diagnosis, dispatch-prioritization only" framing already used in the product UI itself. This is a real content change to a public legal document and deserves its own deliberate pass rather than being folded silently into this security-hardening report — flagging it here rather than editing it unilaterally.
