export const Role = {
  PATIENT: 'PATIENT',
  DOCTOR: 'DOCTOR',
  ADMIN: 'ADMIN',
} as const;
export type Role = (typeof Role)[keyof typeof Role];

export const VisitStatus = {
  REQUESTED: 'REQUESTED',
  ASSIGNED: 'ASSIGNED',
  EN_ROUTE: 'EN_ROUTE',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;
export type VisitStatus = (typeof VisitStatus)[keyof typeof VisitStatus];

export const VisitPaymentStatus = {
  UNPAID: 'UNPAID',
  PAID: 'PAID',
  REFUNDED: 'REFUNDED',
} as const;
export type VisitPaymentStatus = (typeof VisitPaymentStatus)[keyof typeof VisitPaymentStatus];

export const DoctorStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  SUSPENDED: 'SUSPENDED',
} as const;
export type DoctorStatus = (typeof DoctorStatus)[keyof typeof DoctorStatus];

export const PaymentStatus = {
  CREATED: 'CREATED',
  PAID: 'PAID',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const TriagePriority = {
  GREEN: 'GREEN',
  ORANGE: 'ORANGE',
  RED: 'RED',
} as const;
export type TriagePriority = (typeof TriagePriority)[keyof typeof TriagePriority];

export const BookingRelation = {
  SELF: 'SELF',
  PARENT: 'PARENT',
  SPOUSE: 'SPOUSE',
  CHILD: 'CHILD',
  OTHER_FAMILY: 'OTHER_FAMILY',
} as const;
export type BookingRelation = (typeof BookingRelation)[keyof typeof BookingRelation];
