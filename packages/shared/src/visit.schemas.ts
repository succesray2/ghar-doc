import { z } from 'zod';
import { VisitStatus, BookingRelation } from './enums';
import { DurationOption, SeverityOption } from './triage-rules';

const DURATION_VALUES = Object.values(DurationOption) as [string, ...string[]];
const SEVERITY_VALUES = Object.values(SeverityOption) as [string, ...string[]];
const BOOKING_RELATION_VALUES = Object.values(BookingRelation) as [string, ...string[]];

export const SymptomAnswerSchema = z.object({
  symptomId: z.string().min(1),
  duration: z.enum(DURATION_VALUES as [DurationOption, ...DurationOption[]]).optional(),
  startedAt: z.string().optional(),
  severity: z.enum(SEVERITY_VALUES as [SeverityOption, ...SeverityOption[]]).optional(),
  associatedSigns: z.record(z.boolean()).optional(),
});

export const TriageAnswersSchema = z.object({
  symptoms: z.array(SymptomAnswerSchema).min(1),
  otherSymptomText: z.string().optional(),
});
export type TriageAnswersInput = z.infer<typeof TriageAnswersSchema>;

export const TriagePreviewSchema = z.object({
  triageAnswers: TriageAnswersSchema,
});
export type TriagePreviewInput = z.infer<typeof TriagePreviewSchema>;

export const CreateVisitSchema = z
  .object({
    reasonForVisit: z.string().min(3),
    notes: z.string().optional(),
    addressLine1: z.string().min(1),
    addressLine2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    postalCode: z.string().min(1),
    bookingFor: z.enum(BOOKING_RELATION_VALUES as [BookingRelation, ...BookingRelation[]]).default('SELF'),
    patientName: z.string().min(1).optional(),
    patientAge: z.coerce.number().int().positive().optional(),
    patientSex: z.string().optional(),
    caregiverName: z.string().min(1).optional(),
    caregiverPhone: z.string().min(7).optional(),
    triageAnswers: TriageAnswersSchema,
    redFlagAcknowledged: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    if (data.bookingFor !== 'SELF') {
      if (!data.patientName) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['patientName'], message: 'Required when booking for someone else' });
      }
      if (!data.caregiverName) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['caregiverName'], message: 'Required when booking for someone else' });
      }
      if (!data.caregiverPhone) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['caregiverPhone'], message: 'Required when booking for someone else' });
      }
    }
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
