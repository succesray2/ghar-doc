import { type UpdateNotificationPreferencesInput } from '@ghar-doc/shared';
import { NotificationsService } from './notifications.service';
import type { AuthenticatedUser } from '../auth/types';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findMine(user: AuthenticatedUser): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        category: import("@prisma/client").$Enums.NotificationCategory;
        title: string;
        body: string;
        readAt: Date | null;
        visitId: string | null;
    }[]>;
    getPreferences(user: AuthenticatedUser): Promise<{
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
    updatePreferences(user: AuthenticatedUser, body: UpdateNotificationPreferencesInput): Promise<{
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
    markRead(id: string, user: AuthenticatedUser): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        category: import("@prisma/client").$Enums.NotificationCategory;
        title: string;
        body: string;
        readAt: Date | null;
        visitId: string | null;
    }>;
}
