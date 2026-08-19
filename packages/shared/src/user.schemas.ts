import { z } from 'zod';

export const UpdateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().min(7).optional(),
});
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

export const UpdateDoctorAvailabilitySchema = z.object({
  isAvailable: z.boolean(),
});
export type UpdateDoctorAvailabilityInput = z.infer<typeof UpdateDoctorAvailabilitySchema>;
