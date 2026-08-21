export declare const Role: {
    readonly PATIENT: "PATIENT";
    readonly DOCTOR: "DOCTOR";
    readonly ADMIN: "ADMIN";
};
export type Role = (typeof Role)[keyof typeof Role];
export declare const VisitStatus: {
    readonly REQUESTED: "REQUESTED";
    readonly ASSIGNED: "ASSIGNED";
    readonly EN_ROUTE: "EN_ROUTE";
    readonly IN_PROGRESS: "IN_PROGRESS";
    readonly COMPLETED: "COMPLETED";
    readonly CANCELLED: "CANCELLED";
};
export type VisitStatus = (typeof VisitStatus)[keyof typeof VisitStatus];
export declare const VisitPaymentStatus: {
    readonly UNPAID: "UNPAID";
    readonly PAID: "PAID";
    readonly REFUNDED: "REFUNDED";
};
export type VisitPaymentStatus = (typeof VisitPaymentStatus)[keyof typeof VisitPaymentStatus];
export declare const DoctorStatus: {
    readonly PENDING: "PENDING";
    readonly APPROVED: "APPROVED";
    readonly REJECTED: "REJECTED";
    readonly SUSPENDED: "SUSPENDED";
};
export type DoctorStatus = (typeof DoctorStatus)[keyof typeof DoctorStatus];
export declare const PaymentStatus: {
    readonly CREATED: "CREATED";
    readonly PAID: "PAID";
    readonly FAILED: "FAILED";
    readonly REFUNDED: "REFUNDED";
};
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];
export declare const TriagePriority: {
    readonly GREEN: "GREEN";
    readonly ORANGE: "ORANGE";
    readonly RED: "RED";
};
export type TriagePriority = (typeof TriagePriority)[keyof typeof TriagePriority];
export declare const BookingRelation: {
    readonly SELF: "SELF";
    readonly PARENT: "PARENT";
    readonly SPOUSE: "SPOUSE";
    readonly CHILD: "CHILD";
    readonly OTHER_FAMILY: "OTHER_FAMILY";
};
export type BookingRelation = (typeof BookingRelation)[keyof typeof BookingRelation];
