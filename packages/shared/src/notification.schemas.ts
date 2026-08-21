import { z } from 'zod';

export const UpdateNotificationPreferencesSchema = z.object({
  bookingUpdates: z.boolean().optional(),
  providerAssignment: z.boolean().optional(),
  providerArrival: z.boolean().optional(),
  serviceUpdates: z.boolean().optional(),
  paymentUpdates: z.boolean().optional(),
  generalNotifications: z.boolean().optional(),
});
export type UpdateNotificationPreferencesInput = z.infer<typeof UpdateNotificationPreferencesSchema>;
