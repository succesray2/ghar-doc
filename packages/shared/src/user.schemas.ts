import { z } from 'zod';
import { DoctorStatus } from './enums';

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

const DOCTOR_STATUS_VALUES = Object.values(DoctorStatus) as [string, ...string[]];

export const UpdateDoctorStatusSchema = z.object({
  status: z.enum(DOCTOR_STATUS_VALUES as [DoctorStatus, ...DoctorStatus[]]),
  reason: z.string().min(1).optional(),
});
export type UpdateDoctorStatusInput = z.infer<typeof UpdateDoctorStatusSchema>;
