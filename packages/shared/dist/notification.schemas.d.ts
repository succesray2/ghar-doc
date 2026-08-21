import { z } from 'zod';
export declare const UpdateNotificationPreferencesSchema: z.ZodObject<{
    bookingUpdates: z.ZodOptional<z.ZodBoolean>;
    providerAssignment: z.ZodOptional<z.ZodBoolean>;
    providerArrival: z.ZodOptional<z.ZodBoolean>;
    serviceUpdates: z.ZodOptional<z.ZodBoolean>;
    paymentUpdates: z.ZodOptional<z.ZodBoolean>;
    generalNotifications: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    bookingUpdates?: boolean | undefined;
    providerAssignment?: boolean | undefined;
    providerArrival?: boolean | undefined;
    serviceUpdates?: boolean | undefined;
    paymentUpdates?: boolean | undefined;
    generalNotifications?: boolean | undefined;
}, {
    bookingUpdates?: boolean | undefined;
    providerAssignment?: boolean | undefined;
    providerArrival?: boolean | undefined;
    serviceUpdates?: boolean | undefined;
    paymentUpdates?: boolean | undefined;
    generalNotifications?: boolean | undefined;
}>;
export type UpdateNotificationPreferencesInput = z.infer<typeof UpdateNotificationPreferencesSchema>;
