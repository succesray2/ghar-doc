import { z } from 'zod';
import { NurseStatus, PhysiotherapistStatus } from './enums';

// Nurse/Physiotherapist accounts are admin-created only — no public signup
// path exists (unlike SignupDoctorSchema), so these live here rather than
// in auth.schemas.ts.

// An HTML form's untouched optional text input submits '', not undefined --
// plain `z.string().min(7).optional()` rejects that empty string instead of
// treating it as "not provided". Coerce '' to undefined first.
const optionalPhone = z.preprocess((v) => (v === '' ? undefined : v), z.string().min(7).optional());

export const AdminCreateNurseSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: optionalPhone,
  licenseNumber: z.string().min(1),
  qualification: z.string().min(1),
  yearsExperience: z.coerce.number().int().min(0).optional(),
  bio: z.string().optional(),
});
export type AdminCreateNurseInput = z.infer<typeof AdminCreateNurseSchema>;

export const AdminCreatePhysiotherapistSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: optionalPhone,
  licenseNumber: z.string().min(1),
  specialty: z.string().min(1),
  yearsExperience: z.coerce.number().int().min(0).optional(),
  bio: z.string().optional(),
});
export type AdminCreatePhysiotherapistInput = z.infer<typeof AdminCreatePhysiotherapistSchema>;

const NURSE_STATUS_VALUES = Object.values(NurseStatus) as [string, ...string[]];

export const UpdateNurseStatusSchema = z.object({
  status: z.enum(NURSE_STATUS_VALUES as [NurseStatus, ...NurseStatus[]]),
  reason: z.string().min(1).optional(),
});
export type UpdateNurseStatusInput = z.infer<typeof UpdateNurseStatusSchema>;

const PHYSIOTHERAPIST_STATUS_VALUES = Object.values(PhysiotherapistStatus) as [string, ...string[]];

export const UpdatePhysiotherapistStatusSchema = z.object({
  status: z.enum(PHYSIOTHERAPIST_STATUS_VALUES as [PhysiotherapistStatus, ...PhysiotherapistStatus[]]),
  reason: z.string().min(1).optional(),
});
export type UpdatePhysiotherapistStatusInput = z.infer<typeof UpdatePhysiotherapistStatusSchema>;
