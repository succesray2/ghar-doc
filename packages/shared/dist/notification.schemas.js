"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateNotificationPreferencesSchema = void 0;
const zod_1 = require("zod");
exports.UpdateNotificationPreferencesSchema = zod_1.z.object({
    bookingUpdates: zod_1.z.boolean().optional(),
    providerAssignment: zod_1.z.boolean().optional(),
    providerArrival: zod_1.z.boolean().optional(),
    serviceUpdates: zod_1.z.boolean().optional(),
    paymentUpdates: zod_1.z.boolean().optional(),
    generalNotifications: zod_1.z.boolean().optional(),
});
