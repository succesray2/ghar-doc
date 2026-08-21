import { Role, VisitStatus } from './enums';

export interface VisitTransition {
  from: VisitStatus;
  to: VisitStatus;
  allowedRoles: Role[];
}

/**
 * Single source of truth for the visit lifecycle, shared by the API (which
 * enforces it) and the web app (which uses it to decide what buttons to show).
 *
 * PROVIDER_DECLINED->REQUESTED is deliberately NOT listed here — it's a
 * system-only auto-transition (the server chains it atomically onto the
 * decline write, clearing doctorId), never an actor-initiated PATCH. Listing
 * it with a real allowedRoles would wrongly imply a doctor can PATCH a visit
 * straight back to REQUESTED.
 */
export const VISIT_TRANSITIONS: VisitTransition[] = [
  { from: VisitStatus.REQUESTED, to: VisitStatus.ASSIGNED, allowedRoles: [Role.ADMIN] },
  { from: VisitStatus.ASSIGNED, to: VisitStatus.PROVIDER_ACCEPTED, allowedRoles: [Role.DOCTOR] },
  { from: VisitStatus.ASSIGNED, to: VisitStatus.PROVIDER_DECLINED, allowedRoles: [Role.DOCTOR] },
  { from: VisitStatus.PROVIDER_ACCEPTED, to: VisitStatus.EN_ROUTE, allowedRoles: [Role.DOCTOR] },
  { from: VisitStatus.EN_ROUTE, to: VisitStatus.ARRIVED, allowedRoles: [Role.DOCTOR] },
  { from: VisitStatus.ARRIVED, to: VisitStatus.IN_PROGRESS, allowedRoles: [Role.DOCTOR] },
  { from: VisitStatus.IN_PROGRESS, to: VisitStatus.COMPLETED, allowedRoles: [Role.DOCTOR] },
  { from: VisitStatus.REQUESTED, to: VisitStatus.CANCELLED, allowedRoles: [Role.PATIENT, Role.ADMIN] },
  { from: VisitStatus.ASSIGNED, to: VisitStatus.CANCELLED, allowedRoles: [Role.PATIENT, Role.ADMIN] },
  { from: VisitStatus.PROVIDER_ACCEPTED, to: VisitStatus.CANCELLED, allowedRoles: [Role.PATIENT, Role.ADMIN] },
  { from: VisitStatus.EN_ROUTE, to: VisitStatus.CANCELLED, allowedRoles: [Role.ADMIN] },
  { from: VisitStatus.ARRIVED, to: VisitStatus.CANCELLED, allowedRoles: [Role.ADMIN] },
  { from: VisitStatus.REQUESTED, to: VisitStatus.NO_PROVIDER_AVAILABLE, allowedRoles: [Role.ADMIN] },
  { from: VisitStatus.NO_PROVIDER_AVAILABLE, to: VisitStatus.REQUESTED, allowedRoles: [Role.ADMIN] },
];

export function getLegalTransitions(status: VisitStatus, role: Role): VisitTransition[] {
  return VISIT_TRANSITIONS.filter((t) => t.from === status && t.allowedRoles.includes(role));
}

export function isTransitionAllowed(from: VisitStatus, to: VisitStatus, role: Role): boolean {
  return VISIT_TRANSITIONS.some((t) => t.from === from && t.to === to && t.allowedRoles.includes(role));
}
