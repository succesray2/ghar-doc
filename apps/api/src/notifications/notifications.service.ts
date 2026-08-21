import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { NotificationCategory, type UpdateNotificationPreferencesInput } from '@ghar-doc/shared';
import { PrismaService } from '../prisma/prisma.service';

const PREFERENCE_FIELD: Record<NotificationCategory, string> = {
  [NotificationCategory.BOOKING_UPDATE]: 'bookingUpdates',
  [NotificationCategory.PROVIDER_ASSIGNMENT]: 'providerAssignment',
  [NotificationCategory.PROVIDER_ARRIVAL]: 'providerArrival',
  [NotificationCategory.SERVICE_UPDATE]: 'serviceUpdates',
  [NotificationCategory.PAYMENT_UPDATE]: 'paymentUpdates',
  [NotificationCategory.GENERAL]: 'generalNotifications',
};

const DEFAULT_PREFERENCES = {
  bookingUpdates: true,
  providerAssignment: true,
  providerArrival: true,
  serviceUpdates: true,
  paymentUpdates: true,
  generalNotifications: true,
};

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Creates a real, persisted in-app notification — the only delivery
   *  channel today (no SMS/push provider is configured). Gated by the
   *  recipient's preference for this category: if they've turned it off,
   *  no row is written at all, a genuine effect, not an inert toggle. */
  async notify(userId: string, category: NotificationCategory, title: string, body: string, visitId?: string) {
    const pref = await this.prisma.notificationPreference.findUnique({ where: { userId } });
    const field = PREFERENCE_FIELD[category] as keyof typeof DEFAULT_PREFERENCES;
    const enabled = pref ? (pref as unknown as Record<string, boolean>)[field] : DEFAULT_PREFERENCES[field];
    if (!enabled) return null;

    return this.prisma.notification.create({
      data: { userId, category, title, body, visitId },
    });
  }

  async findMine(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async markRead(id: string, userId: string) {
    const notification = await this.prisma.notification.findUnique({ where: { id } });
    if (!notification) throw new NotFoundException('Notification not found');
    if (notification.userId !== userId) throw new ForbiddenException('You do not have access to this notification');
    return this.prisma.notification.update({ where: { id }, data: { readAt: new Date() } });
  }

  async getPreferences(userId: string) {
    const pref = await this.prisma.notificationPreference.findUnique({ where: { userId } });
    return pref ?? { userId, ...DEFAULT_PREFERENCES };
  }

  async updatePreferences(userId: string, patch: UpdateNotificationPreferencesInput) {
    return this.prisma.notificationPreference.upsert({
      where: { userId },
      create: { userId, ...DEFAULT_PREFERENCES, ...patch },
      update: patch,
    });
  }
}
