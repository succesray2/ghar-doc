import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
export type LoginInput = z.infer<typeof LoginSchema>;

export const SignupPatientSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().min(7).optional(),
  addressLine1: z.string().min(1),
  addressLine2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(1),
});
export type SignupPatientInput = z.infer<typeof SignupPatientSchema>;

export const SignupDoctorSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().min(7).optional(),
  licenseNumber: z.string().min(1),
  specialty: z.string().min(1),
  yearsExperience: z.coerce.number().int().min(0).optional(),
  bio: z.string().optional(),
});
export type SignupDoctorInput = z.infer<typeof SignupDoctorSchema>;

export const RefreshSchema = z.object({
  refreshToken: z.string().optional(),
});
export type RefreshInput = z.infer<typeof RefreshSchema>;
