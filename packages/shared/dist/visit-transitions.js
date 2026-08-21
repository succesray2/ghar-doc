"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VISIT_TRANSITIONS = void 0;
exports.getLegalTransitions = getLegalTransitions;
exports.isTransitionAllowed = isTransitionAllowed;
const enums_1 = require("./enums");
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
exports.VISIT_TRANSITIONS = [
    { from: enums_1.VisitStatus.REQUESTED, to: enums_1.VisitStatus.ASSIGNED, allowedRoles: [enums_1.Role.ADMIN] },
    { from: enums_1.VisitStatus.ASSIGNED, to: enums_1.VisitStatus.PROVIDER_ACCEPTED, allowedRoles: [enums_1.Role.DOCTOR] },
    { from: enums_1.VisitStatus.ASSIGNED, to: enums_1.VisitStatus.PROVIDER_DECLINED, allowedRoles: [enums_1.Role.DOCTOR] },
    { from: enums_1.VisitStatus.PROVIDER_ACCEPTED, to: enums_1.VisitStatus.EN_ROUTE, allowedRoles: [enums_1.Role.DOCTOR] },
    { from: enums_1.VisitStatus.EN_ROUTE, to: enums_1.VisitStatus.ARRIVED, allowedRoles: [enums_1.Role.DOCTOR] },
    { from: enums_1.VisitStatus.ARRIVED, to: enums_1.VisitStatus.IN_PROGRESS, allowedRoles: [enums_1.Role.DOCTOR] },
    { from: enums_1.VisitStatus.IN_PROGRESS, to: enums_1.VisitStatus.COMPLETED, allowedRoles: [enums_1.Role.DOCTOR] },
    { from: enums_1.VisitStatus.REQUESTED, to: enums_1.VisitStatus.CANCELLED, allowedRoles: [enums_1.Role.PATIENT, enums_1.Role.ADMIN] },
    { from: enums_1.VisitStatus.ASSIGNED, to: enums_1.VisitStatus.CANCELLED, allowedRoles: [enums_1.Role.PATIENT, enums_1.Role.ADMIN] },
    { from: enums_1.VisitStatus.PROVIDER_ACCEPTED, to: enums_1.VisitStatus.CANCELLED, allowedRoles: [enums_1.Role.PATIENT, enums_1.Role.ADMIN] },
    { from: enums_1.VisitStatus.EN_ROUTE, to: enums_1.VisitStatus.CANCELLED, allowedRoles: [enums_1.Role.ADMIN] },
    { from: enums_1.VisitStatus.ARRIVED, to: enums_1.VisitStatus.CANCELLED, allowedRoles: [enums_1.Role.ADMIN] },
    { from: enums_1.VisitStatus.REQUESTED, to: enums_1.VisitStatus.NO_PROVIDER_AVAILABLE, allowedRoles: [enums_1.Role.ADMIN] },
    { from: enums_1.VisitStatus.NO_PROVIDER_AVAILABLE, to: enums_1.VisitStatus.REQUESTED, allowedRoles: [enums_1.Role.ADMIN] },
];
function getLegalTransitions(status, role) {
    return exports.VISIT_TRANSITIONS.filter((t) => t.from === status && t.allowedRoles.includes(role));
}
function isTransitionAllowed(from, to, role) {
    return exports.VISIT_TRANSITIONS.some((t) => t.from === from && t.to === to && t.allowedRoles.includes(role));
}
