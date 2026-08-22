import { z } from 'zod';
import { VisitStatus, BookingRelation, ServiceType } from './enums';
import { DurationOption, SeverityOption } from './triage-rules';
import { NursingServiceDetailsSchema, PhysiotherapyServiceDetailsSchema } from './service-intake';
import { SafetyNetAnswersSchema } from './safety-net';

const DURATION_VALUES = Object.values(DurationOption) as [string, ...string[]];
const SEVERITY_VALUES = Object.values(SeverityOption) as [string, ...string[]];
const BOOKING_RELATION_VALUES = Object.values(BookingRelation) as [string, ...string[]];
const SERVICE_TYPE_VALUES = Object.values(ServiceType) as [ServiceType, ...ServiceType[]];

export const SymptomAnswerSchema = z.object({
  symptomId: z.string().min(1),
  duration: z.enum(DURATION_VALUES as [DurationOption, ...DurationOption[]]).optional(),
  startedAt: z.string().optional(),
  severity: z.enum(SEVERITY_VALUES as [SeverityOption, ...SeverityOption[]]).optional(),
  associatedSigns: z.record(z.boolean()).optional(),
  bodyRegion: z.string().optional(),
  numericReadings: z
    .object({
      systolic: z.coerce.number().optional(),
      diastolic: z.coerce.number().optional(),
      temperature: z.coerce.number().optional(),
      temperatureUnit: z.enum(['C', 'F']).optional(),
    })
    .optional(),
  knownCondition: z.boolean().optional(),
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
    serviceType: z.enum(SERVICE_TYPE_VALUES).default('DOCTOR_VISIT'),
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
    // Required only for serviceType DOCTOR_VISIT — see superRefine below.
    // Optional here (rather than a discriminated union) so an old client
    // posting today's exact payload, with no serviceType field at all,
    // keeps behaving byte-identical to today.
    triageAnswers: TriageAnswersSchema.optional(),
    redFlagAcknowledged: z.boolean().default(false),
    // Required only for serviceType NURSING / PHYSIOTHERAPY respectively.
    nursingDetails: NursingServiceDetailsSchema.optional(),
    physiotherapyDetails: PhysiotherapyServiceDetailsSchema.optional(),
    safetyCheckAnswers: SafetyNetAnswersSchema.optional(),
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
    if (data.serviceType === 'DOCTOR_VISIT' && !data.triageAnswers) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['triageAnswers'], message: 'Required for a doctor visit request' });
    }
    if (data.serviceType === 'NURSING') {
      if (!data.nursingDetails) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['nursingDetails'], message: 'Required for a nursing request' });
      }
      if (!data.safetyCheckAnswers) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['safetyCheckAnswers'], message: 'Required for a nursing request' });
      }
    }
    if (data.serviceType === 'PHYSIOTHERAPY') {
      if (!data.physiotherapyDetails) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['physiotherapyDetails'], message: 'Required for a physiotherapy request' });
      }
      if (!data.safetyCheckAnswers) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['safetyCheckAnswers'], message: 'Required for a physiotherapy request' });
      }
    }
  });
export type CreateVisitInput = z.infer<typeof CreateVisitSchema>;

export const AssignProviderSchema = z
  .object({
    doctorId: z.string().min(1).optional(),
    nurseId: z.string().min(1).optional(),
    physiotherapistId: z.string().min(1).optional(),
  })
  .superRefine((data, ctx) => {
    const provided = [data.doctorId, data.nurseId, data.physiotherapistId].filter(Boolean);
    if (provided.length !== 1) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Exactly one of doctorId, nurseId, or physiotherapistId is required' });
    }
  });
export type AssignProviderInput = z.infer<typeof AssignProviderSchema>;

const VISIT_STATUS_VALUES = Object.values(VisitStatus) as [string, ...string[]];

export const UpdateVisitStatusSchema = z.object({
  status: z.enum(VISIT_STATUS_VALUES as [VisitStatus, ...VisitStatus[]]),
});
export type UpdateVisitStatusInput = z.infer<typeof UpdateVisitStatusSchema>;

export const CancelVisitSchema = z.object({
  reason: z.string().optional(),
});
export type CancelVisitInput = z.infer<typeof CancelVisitSchema>;
