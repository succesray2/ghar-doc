"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const shared_1 = require("@ghar-doc/shared");
const prisma_service_1 = require("../prisma/prisma.service");
const PREFERENCE_FIELD = {
    [shared_1.NotificationCategory.BOOKING_UPDATE]: 'bookingUpdates',
    [shared_1.NotificationCategory.PROVIDER_ASSIGNMENT]: 'providerAssignment',
    [shared_1.NotificationCategory.PROVIDER_ARRIVAL]: 'providerArrival',
    [shared_1.NotificationCategory.SERVICE_UPDATE]: 'serviceUpdates',
    [shared_1.NotificationCategory.PAYMENT_UPDATE]: 'paymentUpdates',
    [shared_1.NotificationCategory.GENERAL]: 'generalNotifications',
};
const DEFAULT_PREFERENCES = {
    bookingUpdates: true,
    providerAssignment: true,
    providerArrival: true,
    serviceUpdates: true,
    paymentUpdates: true,
    generalNotifications: true,
};
let NotificationsService = class NotificationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async notify(userId, category, title, body, visitId) {
        const pref = await this.prisma.notificationPreference.findUnique({ where: { userId } });
        const field = PREFERENCE_FIELD[category];
        const enabled = pref ? pref[field] : DEFAULT_PREFERENCES[field];
        if (!enabled)
            return null;
        return this.prisma.notification.create({
            data: { userId, category, title, body, visitId },
        });
    }
    async findMine(userId) {
        return this.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 100,
        });
    }
    async markRead(id, userId) {
        const notification = await this.prisma.notification.findUnique({ where: { id } });
        if (!notification)
            throw new common_1.NotFoundException('Notification not found');
        if (notification.userId !== userId)
            throw new common_1.ForbiddenException('You do not have access to this notification');
        return this.prisma.notification.update({ where: { id }, data: { readAt: new Date() } });
    }
    async getPreferences(userId) {
        const pref = await this.prisma.notificationPreference.findUnique({ where: { userId } });
        return pref ?? { userId, ...DEFAULT_PREFERENCES };
    }
    async updatePreferences(userId, patch) {
        return this.prisma.notificationPreference.upsert({
            where: { userId },
            create: { userId, ...DEFAULT_PREFERENCES, ...patch },
            update: patch,
        });
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map