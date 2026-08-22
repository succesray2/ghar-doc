import { NotificationCategory, type UpdateNotificationPreferencesInput } from '@ghar-doc/shared';
import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    notify(userId: string, category: NotificationCategory, title: string, body: string, visitId?: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        category: import("@prisma/client").$Enums.NotificationCategory;
        title: string;
        body: string;
        readAt: Date | null;
        visitId: string | null;
    } | null>;
    findMine(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        category: import("@prisma/client").$Enums.NotificationCategory;
        title: string;
        body: string;
        readAt: Date | null;
        visitId: string | null;
    }[]>;
    markRead(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        category: import("@prisma/client").$Enums.NotificationCategory;
        title: string;
        body: string;
        readAt: Date | null;
        visitId: string | null;
    }>;
    getPreferences(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        bookingUpdates: boolean;
        providerAssignment: boolean;
        providerArrival: boolean;
        serviceUpdates: boolean;
        paymentUpdates: boolean;
        generalNotifications: boolean;
    } | {
        bookingUpdates: boolean;
        providerAssignment: boolean;
        providerArrival: boolean;
        serviceUpdates: boolean;
        paymentUpdates: boolean;
        generalNotifications: boolean;
        userId: string;
    }>;
    updatePreferences(userId: string, patch: UpdateNotificationPreferencesInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        bookingUpdates: boolean;
        providerAssignment: boolean;
        providerArrival: boolean;
        serviceUpdates: boolean;
        paymentUpdates: boolean;
        generalNotifications: boolean;
    }>;
}
