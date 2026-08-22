"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FamilyRelation = exports.NotificationCategory = exports.BookingRelation = exports.TriagePriority = exports.PaymentStatus = exports.ServiceType = exports.PhysiotherapistStatus = exports.NurseStatus = exports.DoctorStatus = exports.VisitPaymentStatus = exports.VisitStatus = exports.Role = void 0;
exports.Role = {
    PATIENT: 'PATIENT',
    DOCTOR: 'DOCTOR',
    ADMIN: 'ADMIN',
    NURSE: 'NURSE',
    PHYSIOTHERAPIST: 'PHYSIOTHERAPIST',
};
exports.VisitStatus = {
    REQUESTED: 'REQUESTED',
    ASSIGNED: 'ASSIGNED',
    PROVIDER_ACCEPTED: 'PROVIDER_ACCEPTED',
    PROVIDER_DECLINED: 'PROVIDER_DECLINED',
    EN_ROUTE: 'EN_ROUTE',
    ARRIVED: 'ARRIVED',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
    NO_PROVIDER_AVAILABLE: 'NO_PROVIDER_AVAILABLE',
};
exports.VisitPaymentStatus = {
    UNPAID: 'UNPAID',
    PAID: 'PAID',
    REFUNDED: 'REFUNDED',
};
exports.DoctorStatus = {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    SUSPENDED: 'SUSPENDED',
};
// Nurse/Physiotherapist accounts are admin-created only (no public
// self-serve signup) — account creation is itself the vetting decision, so
// unlike DoctorStatus there is no PENDING/REJECTED state.
exports.NurseStatus = {
    ACTIVE: 'ACTIVE',
    SUSPENDED: 'SUSPENDED',
};
exports.PhysiotherapistStatus = {
    ACTIVE: 'ACTIVE',
    SUSPENDED: 'SUSPENDED',
};
exports.ServiceType = {
    DOCTOR_VISIT: 'DOCTOR_VISIT',
    NURSING: 'NURSING',
    PHYSIOTHERAPY: 'PHYSIOTHERAPY',
};
exports.PaymentStatus = {
    CREATED: 'CREATED',
    PAID: 'PAID',
    FAILED: 'FAILED',
    REFUNDED: 'REFUNDED',
};
exports.TriagePriority = {
    GREEN: 'GREEN',
    ORANGE: 'ORANGE',
    RED: 'RED',
};
exports.BookingRelation = {
    SELF: 'SELF',
    PARENT: 'PARENT',
    SPOUSE: 'SPOUSE',
    CHILD: 'CHILD',
    OTHER_FAMILY: 'OTHER_FAMILY',
};
exports.NotificationCategory = {
    BOOKING_UPDATE: 'BOOKING_UPDATE',
    PROVIDER_ASSIGNMENT: 'PROVIDER_ASSIGNMENT',
    PROVIDER_ARRIVAL: 'PROVIDER_ARRIVAL',
    SERVICE_UPDATE: 'SERVICE_UPDATE',
    PAYMENT_UPDATE: 'PAYMENT_UPDATE',
    GENERAL: 'GENERAL',
};
exports.FamilyRelation = {
    PARENT: 'PARENT',
    SPOUSE: 'SPOUSE',
    CHILD: 'CHILD',
    OTHER: 'OTHER',
};
