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
export declare const VISIT_TRANSITIONS: VisitTransition[];
export declare function getLegalTransitions(status: VisitStatus, role: Role): VisitTransition[];
export declare function isTransitionAllowed(from: VisitStatus, to: VisitStatus, role: Role): boolean;
