import { type VisitStatus, type CreateVisitInput, type AssignDoctorInput, type UpdateVisitStatusInput, type CancelVisitInput } from '@ghar-doc/shared';
import { VisitsService } from './visits.service';
import type { AuthenticatedUser } from '../auth/types';
export declare class VisitsController {
    private readonly visitsService;
    constructor(visitsService: VisitsService);
    create(user: AuthenticatedUser, body: CreateVisitInput): Promise<{
        patient: {
            id: string;
            firstName: string;
            lastName: string;
            phone: string | null;
        };
        doctor: {
            id: string;
            firstName: string;
            lastName: string;
            phone: string | null;
        } | null;
    } & {
        status: import("@prisma/client").$Enums.VisitStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        addressLine1: string;
        addressLine2: string | null;
        city: string;
        state: string;
        postalCode: string;
        lat: number | null;
        lng: number | null;
        assignedAt: Date | null;
        enRouteAt: Date | null;
        inProgressAt: Date | null;
        completedAt: Date | null;
        cancelledAt: Date | null;
        paymentStatus: import("@prisma/client").$Enums.VisitPaymentStatus;
        reasonForVisit: string;
        notes: string | null;
        requestedAt: Date;
        cancellationReason: string | null;
        patientId: string;
        doctorId: string | null;
    }>;
    findAll(status?: VisitStatus): Promise<({
        patient: {
            id: string;
            firstName: string;
            lastName: string;
            phone: string | null;
        };
        doctor: {
            id: string;
            firstName: string;
            lastName: string;
            phone: string | null;
        } | null;
    } & {
        status: import("@prisma/client").$Enums.VisitStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        addressLine1: string;
        addressLine2: string | null;
        city: string;
        state: string;
        postalCode: string;
        lat: number | null;
        lng: number | null;
        assignedAt: Date | null;
        enRouteAt: Date | null;
        inProgressAt: Date | null;
        completedAt: Date | null;
        cancelledAt: Date | null;
        paymentStatus: import("@prisma/client").$Enums.VisitPaymentStatus;
        reasonForVisit: string;
        notes: string | null;
        requestedAt: Date;
        cancellationReason: string | null;
        patientId: string;
        doctorId: string | null;
    })[]>;
    findMine(user: AuthenticatedUser): Promise<({
        patient: {
            id: string;
            firstName: string;
            lastName: string;
            phone: string | null;
        };
        doctor: {
            id: string;
            firstName: string;
            lastName: string;
            phone: string | null;
        } | null;
    } & {
        status: import("@prisma/client").$Enums.VisitStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        addressLine1: string;
        addressLine2: string | null;
        city: string;
        state: string;
        postalCode: string;
        lat: number | null;
        lng: number | null;
        assignedAt: Date | null;
        enRouteAt: Date | null;
        inProgressAt: Date | null;
        completedAt: Date | null;
        cancelledAt: Date | null;
        paymentStatus: import("@prisma/client").$Enums.VisitPaymentStatus;
        reasonForVisit: string;
        notes: string | null;
        requestedAt: Date;
        cancellationReason: string | null;
        patientId: string;
        doctorId: string | null;
    })[]>;
    findAssigned(user: AuthenticatedUser): Promise<({
        patient: {
            id: string;
            firstName: string;
            lastName: string;
            phone: string | null;
        };
        doctor: {
            id: string;
            firstName: string;
            lastName: string;
            phone: string | null;
        } | null;
    } & {
        status: import("@prisma/client").$Enums.VisitStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        addressLine1: string;
        addressLine2: string | null;
        city: string;
        state: string;
        postalCode: string;
        lat: number | null;
        lng: number | null;
        assignedAt: Date | null;
        enRouteAt: Date | null;
        inProgressAt: Date | null;
        completedAt: Date | null;
        cancelledAt: Date | null;
        paymentStatus: import("@prisma/client").$Enums.VisitPaymentStatus;
        reasonForVisit: string;
        notes: string | null;
        requestedAt: Date;
        cancellationReason: string | null;
        patientId: string;
        doctorId: string | null;
    })[]>;
    findOne(id: string, user: AuthenticatedUser): Promise<{
        patient: {
            id: string;
            firstName: string;
            lastName: string;
            phone: string | null;
        };
        doctor: {
            id: string;
            firstName: string;
            lastName: string;
            phone: string | null;
        } | null;
    } & {
        status: import("@prisma/client").$Enums.VisitStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        addressLine1: string;
        addressLine2: string | null;
        city: string;
        state: string;
        postalCode: string;
        lat: number | null;
        lng: number | null;
        assignedAt: Date | null;
        enRouteAt: Date | null;
        inProgressAt: Date | null;
        completedAt: Date | null;
        cancelledAt: Date | null;
        paymentStatus: import("@prisma/client").$Enums.VisitPaymentStatus;
        reasonForVisit: string;
        notes: string | null;
        requestedAt: Date;
        cancellationReason: string | null;
        patientId: string;
        doctorId: string | null;
    }>;
    assign(id: string, body: AssignDoctorInput, user: AuthenticatedUser): Promise<{
        patient: {
            id: string;
            firstName: string;
            lastName: string;
            phone: string | null;
        };
        doctor: {
            id: string;
            firstName: string;
            lastName: string;
            phone: string | null;
        } | null;
    } & {
        status: import("@prisma/client").$Enums.VisitStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        addressLine1: string;
        addressLine2: string | null;
        city: string;
        state: string;
        postalCode: string;
        lat: number | null;
        lng: number | null;
        assignedAt: Date | null;
        enRouteAt: Date | null;
        inProgressAt: Date | null;
        completedAt: Date | null;
        cancelledAt: Date | null;
        paymentStatus: import("@prisma/client").$Enums.VisitPaymentStatus;
        reasonForVisit: string;
        notes: string | null;
        requestedAt: Date;
        cancellationReason: string | null;
        patientId: string;
        doctorId: string | null;
    }>;
    updateStatus(id: string, body: UpdateVisitStatusInput, user: AuthenticatedUser): Promise<{
        patient: {
            id: string;
            firstName: string;
            lastName: string;
            phone: string | null;
        };
        doctor: {
            id: string;
            firstName: string;
            lastName: string;
            phone: string | null;
        } | null;
    } & {
        status: import("@prisma/client").$Enums.VisitStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        addressLine1: string;
        addressLine2: string | null;
        city: string;
        state: string;
        postalCode: string;
        lat: number | null;
        lng: number | null;
        assignedAt: Date | null;
        enRouteAt: Date | null;
        inProgressAt: Date | null;
        completedAt: Date | null;
        cancelledAt: Date | null;
        paymentStatus: import("@prisma/client").$Enums.VisitPaymentStatus;
        reasonForVisit: string;
        notes: string | null;
        requestedAt: Date;
        cancellationReason: string | null;
        patientId: string;
        doctorId: string | null;
    }>;
    cancel(id: string, body: CancelVisitInput, user: AuthenticatedUser): Promise<{
        patient: {
            id: string;
            firstName: string;
            lastName: string;
            phone: string | null;
        };
        doctor: {
            id: string;
            firstName: string;
            lastName: string;
            phone: string | null;
        } | null;
    } & {
        status: import("@prisma/client").$Enums.VisitStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        addressLine1: string;
        addressLine2: string | null;
        city: string;
        state: string;
        postalCode: string;
        lat: number | null;
        lng: number | null;
        assignedAt: Date | null;
        enRouteAt: Date | null;
        inProgressAt: Date | null;
        completedAt: Date | null;
        cancelledAt: Date | null;
        paymentStatus: import("@prisma/client").$Enums.VisitPaymentStatus;
        reasonForVisit: string;
        notes: string | null;
        requestedAt: Date;
        cancellationReason: string | null;
        patientId: string;
        doctorId: string | null;
    }>;
}
