"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingRelation = exports.TriagePriority = exports.PaymentStatus = exports.DoctorStatus = exports.VisitPaymentStatus = exports.VisitStatus = exports.Role = void 0;
exports.Role = {
    PATIENT: 'PATIENT',
    DOCTOR: 'DOCTOR',
    ADMIN: 'ADMIN',
};
exports.VisitStatus = {
    REQUESTED: 'REQUESTED',
    ASSIGNED: 'ASSIGNED',
    EN_ROUTE: 'EN_ROUTE',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
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
