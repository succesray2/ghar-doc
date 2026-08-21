// This Privacy Policy was authored directly against the real GHARDoc
// codebase (not a template) — every statement below was checked against
// what the API/apps actually do before being written. Where a section
// doesn't apply yet (no payment processor, no diagnostics, no analytics,
// no self-serve deletion), it says so plainly instead of describing a
// feature that doesn't exist. Bracketed placeholders ([DD Month YYYY],
// [registered address], etc.) are unfilled legal/business details, not
// invented values — same convention as legal.ts's Terms document.
//
// This document has NOT been reviewed by a lawyer. Per the brief that
// requested it: "The final policy must be reviewed by qualified Indian
// legal counsel before production launch." Do not treat this as launch-
// ready without that review.
export const PRIVACY_POLICY = `# GHARDoc Privacy Policy

**Last Updated:** [DD Month YYYY]
**Effective Date:** [DD Month YYYY]

This Privacy Policy explains what personal data GHARDoc collects, why, how it's used and protected, and what choices you have. It's written to describe what the GHARDoc platform actually does today — not a generic template.

**Entity:** [Registered legal name]
**Registered address:** [Registered business address]
**Privacy contact:** [privacy email]
**Grievance contact:** [grievance email]

## 1. Who is GHARDoc?

GHARDoc is a technology platform that helps you request a doctor home visit. GHARDoc itself is not a hospital, clinic, or licensed healthcare provider — the doctor who accepts and conducts your visit is a licensed medical professional, independently responsible for the clinical care they provide. GHARDoc's role is to connect you with an approved doctor and let you track the visit from request to completion.

## 2. What data we collect

### Account information
Email address, first and last name, phone number (optional), a securely hashed password, and your role (patient, doctor, or admin).

### Patient address information
When you set up a patient account or request a visit, we collect the address where the visit should take place — address line 1, address line 2 (optional), city, state, and postal code.

### Visit information
When you request a visit, we collect the reason for the visit and any additional notes you choose to write, in your own words. We also collect structured information about your symptoms — which symptoms you select from a list, how long they've lasted, how severe they are, answers to a small number of follow-up safety questions, and, for some symptom categories, specific readings you choose to enter (for example a blood pressure or temperature reading). This structured information is used only to help flag requests that may need urgent attention before a doctor reviews them — it's a safety-prioritisation signal, not a diagnosis, and every request is still reviewed by a licensed doctor. If you're booking a visit for someone else (a family member), we also collect that person's name, age, and sex, and the caregiver's name and phone number.

### Doctor information
For doctor accounts: medical license number, specialty, years of experience, and an optional bio, used to review and approve doctors before they can be assigned visits.

### What we do NOT currently collect
Our database has fields reserved for date of birth, gender, an emergency contact, and precise GPS coordinates (latitude/longitude) — but as of this writing, no part of the signup, profile, or visit-request flow actually asks for or stores any of these. If that changes, this policy will be updated before the change ships, not after.

## 3. Family members

GHARDoc does not currently support creating or managing profiles for family members — each account manages visits for the account holder only. If family-member management is added later, this section will be updated with the relevant consent and access controls before that feature launches.

## 4. Children's data

GHARDoc does not currently verify a user's age, and the signup flow does not collect date of birth. The service is intended for adults arranging their own healthcare. We don't knowingly collect data specifically about children, and there is no dedicated child- or family-member account type today. Age-verification and parental-consent mechanisms will be built and disclosed here before any feature targeting children's healthcare is introduced.

## 5. Diagnostic information

GHARDoc's diagnostic testing service is in development and not live yet — no diagnostic bookings, test results, or lab data are currently collected. This section will be completed with real detail once that feature ships.

## 6. Location information

We only ask you to type your address as text. GHARDoc does not currently request or access your device's GPS location on the website or in the mobile app — no location permission is requested anywhere in the product today.

## 7. Payment information

GHARDoc does not currently process payments. No payment gateway is integrated, and no card, UPI, or bank information is collected, stored, or transmitted by the platform at this time.

## 8. Device and technical information

Our hosting and infrastructure providers (see "Who processes data on our behalf" below) may log standard technical information — such as IP address, browser or app type, and request timestamps — as part of normal, routine web server operation. This is used for security and reliability, not for tracking or advertising.

## 9. Cookies

The website and app use exactly one cookie: an httpOnly session cookie that keeps you signed in (it stores a reference used to refresh your login session; it's not readable by JavaScript and isn't used for tracking). We do not use analytics cookies, advertising cookies, or any third-party tracking cookies.

## 10. Why we collect and use this data

| Data | Purpose |
|---|---|
| Name, email, phone | Creating and managing your account, and contacting you about your account or a visit |
| Patient address | Telling the assigned doctor where to go for the home visit |
| Reason for visit / notes | Giving the doctor context before and during the visit |
| Doctor license, specialty, experience | Verifying a doctor before they can be approved and assigned visits |
| Session cookie / refresh token | Keeping you securely signed in between visits to the app |

## 11. Legal basis for processing

GHARDoc processes personal data to provide the service you've requested (creating your account, arranging a doctor visit) and to meet legal obligations where applicable, consistent with India's Digital Personal Data Protection Act, 2023 and its rules. We do not currently run separate marketing-consent or analytics-consent flows, because we don't currently send marketing communications or run analytics.

## 12. Consent and your choices today

Creating an account and requesting a visit is currently the only data-collection flow in the product, and using the service implies you've agreed to provide the information that flow asks for. GHARDoc does not currently have a granular, in-app consent-preference screen (for example, separately toggling marketing vs. service communications) — this is a known gap we intend to address as the product grows, not something we're claiming to already have.

## 13. Your data rights

You can ask us to:
* Tell you what personal data we hold about you
* Correct inaccurate information (the app's Edit Profile screen already lets you update your name and phone directly; other corrections can be requested by contacting us)
* Delete your account and associated data, subject to anything we're legally required to keep

**Right now, account deletion is not a self-serve feature in the app** — it must be requested via the contact details below and will be actioned manually until an automated deletion workflow is built. We're flagging this honestly rather than describing a self-serve flow that doesn't exist yet.

## 14. Data retention

We do not yet have a formally defined, per-category retention schedule. In practice, data is retained for as long as your account is active. **This is an area explicitly flagged for legal and business review before GHARDoc launches with real patients** — a proper retention schedule (how long visit records, account information, and audit logs are kept, and when they're deleted) needs to be defined and published here before that happens.

## 15. Who we share data with

* **The doctor assigned to your visit** — sees the visit details (reason, notes, address) and your name/phone needed to conduct the visit.
* **GHARDoc administrators** — can see visit records across the platform in order to assign doctors and operate the service; access is scoped by account role (patient, doctor, admin) in our system, not open to every internal user.
* **Hosting and database providers** — process data on our behalf to run the platform (see below). They don't use your data for their own purposes.
* **Legal or regulatory authorities** — only where GHARDoc is legally required to disclose information.

We do not sell personal data, and we do not share it for advertising purposes.

## 16. Who processes data on our behalf

* **Render** — hosts the website, app, and API.
* **Neon** — hosts the Postgres database.

These are the only third-party infrastructure providers currently in use. We do not use any analytics, SMS, email, WhatsApp, payment, or AI service providers today — if we start using one, this section will name it before it goes live, not after.

## 17. International data transfers

**Yes — some data is currently processed outside India.** Our database (via Neon) and application hosting (via Render) currently run on infrastructure located in the United States. If this changes, or if data localisation becomes a requirement we need to meet, this section will be updated to reflect the real setup at that time.

## 18. Data security

What we actually do today:
* Passwords are never stored in plain text — they're hashed before storage.
* Refresh tokens (used to keep you signed in) are stored as hashes, not as the raw token — the raw token only ever exists in your browser or device.
* The session cookie is httpOnly (not readable by page scripts) and, in production, marked Secure and SameSite=None so it's only sent over encrypted connections.
* Access to visit and account data is restricted by role in our backend (a patient's API access is limited to their own data; a doctor's to visits assigned to them; admin access is broader, scoped to operating the platform).
* All traffic to the website, app, and API travels over HTTPS.
* Repeated failed login attempts are automatically slowed down and, if they continue, temporarily locked out (never permanently) to resist automated password-guessing.
* Administrative actions that affect your account or a visit (such as approving or suspending a doctor) are logged with who performed them and when, for accountability.

What we do **not** currently claim: we have not undergone a third-party security audit or penetration test, and we do not hold any security certification (e.g. ISO 27001, SOC 2). We're not going to claim either until it's actually true.

## 19. Doctor access to your information

When you request a visit, the doctor it's assigned to can see the visit details and the contact information needed to reach you and conduct the visit. Doctors do not have access to other patients' visits, or to your information before a visit is assigned to them.

## 20. Marketing communications

GHARDoc does not currently send marketing emails, SMS, or push notifications of any kind — there's no marketing communication infrastructure in the product today. If that changes, it will be opt-in, separate from service communications, and disclosed here first.

## 21. Analytics

GHARDoc does not currently use any analytics, tracking, or measurement service (no Google Analytics, no product-analytics SDK, nothing) on the website or in the app.

## 22. AI features

GHARDoc does not currently use AI to process any personal or health information. If an AI feature is introduced later, this section will explain exactly what's processed, whether an external AI provider is involved, and whether any data is used for model training — before that feature ships, not after.

## 23. Health guides and educational content

Any health articles or guides on the platform are written for general education. They're not personalised using your health information, and they're not a substitute for advice from a qualified doctor.

## 24. Security incidents

If we identify a security incident affecting personal data, we will investigate, contain it, and take steps to secure affected systems. We maintain a documented incident-response process (detection, account suspension, session revocation, evidence preservation) — it has not yet been tested against a real incident, and exactly when and how affected users would be notified is still being finalised with legal counsel, consistent with applicable law.

## 25. Third-party links

If GHARDoc ever links to an external website or service, that service's own privacy policy applies to it — this policy only covers GHARDoc itself.

## 26. Account security — your part

Please keep your password confidential, use your own account rather than sharing login details, and log out on shared or public devices. GHARDoc will never ask you to share your password with our support team.

## 27. Grievance redressal

**Grievance Officer:** [Name / Designation]
**Grievance email:** [grievance email]
**Grievance phone:** [phone]

We will handle privacy-related complaints in accordance with applicable law.

## 28. Changes to this policy

We may update this policy as GHARDoc's features change. The "Last Updated" date at the top will change whenever we do, and we won't make a significant change to how health-related data is handled without updating this page to reflect it.

## 29. Contact us

**Privacy questions**
Email: [privacy email]
Phone: [phone]
Address: [registered address]

**Last Updated:** [DD Month YYYY]`;
