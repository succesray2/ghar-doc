import { VisitStatus, type CreateVisitInput } from '@ghar-doc/shared';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthenticatedUser } from '../auth/types';
export declare class VisitsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(patientId: string, input: CreateVisitInput): Promise<{
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
    findMine(patientId: string): Promise<({
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
    findAssigned(doctorId: string): Promise<({
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
    findOneForUser(id: string, user: AuthenticatedUser): Promise<{
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
    assign(id: string, doctorId: string, actor: AuthenticatedUser): Promise<{
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
    updateStatus(id: string, status: VisitStatus, actor: AuthenticatedUser): Promise<{
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
    cancel(id: string, actor: AuthenticatedUser, reason?: string): Promise<{
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
    private transition;
    private getOrThrow;
    private assertCanView;
}
