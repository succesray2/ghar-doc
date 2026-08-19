import { z } from 'zod';
import { VisitStatus } from './enums';

export const CreateVisitSchema = z.object({
  reasonForVisit: z.string().min(3),
  notes: z.string().optional(),
  addressLine1: z.string().min(1),
  addressLine2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(1),
});
export type CreateVisitInput = z.infer<typeof CreateVisitSchema>;

export const AssignDoctorSchema = z.object({
  doctorId: z.string().min(1),
});
export type AssignDoctorInput = z.infer<typeof AssignDoctorSchema>;

const VISIT_STATUS_VALUES = Object.values(VisitStatus) as [string, ...string[]];

export const UpdateVisitStatusSchema = z.object({
  status: z.enum(VISIT_STATUS_VALUES as [VisitStatus, ...VisitStatus[]]),
});
export type UpdateVisitStatusInput = z.infer<typeof UpdateVisitStatusSchema>;

export const CancelVisitSchema = z.object({
  reason: z.string().optional(),
});
export type CancelVisitInput = z.infer<typeof CancelVisitSchema>;
