export const Role = {
  PATIENT: 'PATIENT',
  DOCTOR: 'DOCTOR',
  ADMIN: 'ADMIN',
  NURSE: 'NURSE',
  PHYSIOTHERAPIST: 'PHYSIOTHERAPIST',
} as const;
export type Role = (typeof Role)[keyof typeof Role];

export const VisitStatus = {
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

// Nurse/Physiotherapist accounts are admin-created only (no public
// self-serve signup) — account creation is itself the vetting decision, so
// unlike DoctorStatus there is no PENDING/REJECTED state.
export const NurseStatus = {
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
} as const;
export type NurseStatus = (typeof NurseStatus)[keyof typeof NurseStatus];

export const PhysiotherapistStatus = {
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
} as const;
export type PhysiotherapistStatus = (typeof PhysiotherapistStatus)[keyof typeof PhysiotherapistStatus];

export const ServiceType = {
  DOCTOR_VISIT: 'DOCTOR_VISIT',
  NURSING: 'NURSING',
  PHYSIOTHERAPY: 'PHYSIOTHERAPY',
} as const;
export type ServiceType = (typeof ServiceType)[keyof typeof ServiceType];

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

export const NotificationCategory = {
  BOOKING_UPDATE: 'BOOKING_UPDATE',
  PROVIDER_ASSIGNMENT: 'PROVIDER_ASSIGNMENT',
  PROVIDER_ARRIVAL: 'PROVIDER_ARRIVAL',
  SERVICE_UPDATE: 'SERVICE_UPDATE',
  PAYMENT_UPDATE: 'PAYMENT_UPDATE',
  GENERAL: 'GENERAL',
} as const;
export type NotificationCategory = (typeof NotificationCategory)[keyof typeof NotificationCategory];

export const FamilyRelation = {
  PARENT: 'PARENT',
  SPOUSE: 'SPOUSE',
  CHILD: 'CHILD',
  OTHER: 'OTHER',
} as const;
export type FamilyRelation = (typeof FamilyRelation)[keyof typeof FamilyRelation];
