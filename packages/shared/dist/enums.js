"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorStatus = exports.VisitPaymentStatus = exports.VisitStatus = exports.Role = void 0;
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
