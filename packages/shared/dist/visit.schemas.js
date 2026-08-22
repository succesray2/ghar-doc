"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelVisitSchema = exports.UpdateVisitStatusSchema = exports.AssignProviderSchema = exports.CreateVisitSchema = exports.TriagePreviewSchema = exports.TriageAnswersSchema = exports.SymptomAnswerSchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("./enums");
const triage_rules_1 = require("./triage-rules");
const service_intake_1 = require("./service-intake");
const safety_net_1 = require("./safety-net");
const DURATION_VALUES = Object.values(triage_rules_1.DurationOption);
const SEVERITY_VALUES = Object.values(triage_rules_1.SeverityOption);
const BOOKING_RELATION_VALUES = Object.values(enums_1.BookingRelation);
const SERVICE_TYPE_VALUES = Object.values(enums_1.ServiceType);
exports.SymptomAnswerSchema = zod_1.z.object({
    symptomId: zod_1.z.string().min(1),
    duration: zod_1.z.enum(DURATION_VALUES).optional(),
    startedAt: zod_1.z.string().optional(),
    severity: zod_1.z.enum(SEVERITY_VALUES).optional(),
    associatedSigns: zod_1.z.record(zod_1.z.boolean()).optional(),
    bodyRegion: zod_1.z.string().optional(),
    numericReadings: zod_1.z
        .object({
        systolic: zod_1.z.coerce.number().optional(),
        diastolic: zod_1.z.coerce.number().optional(),
        temperature: zod_1.z.coerce.number().optional(),
        temperatureUnit: zod_1.z.enum(['C', 'F']).optional(),
    })
        .optional(),
    knownCondition: zod_1.z.boolean().optional(),
});
exports.TriageAnswersSchema = zod_1.z.object({
    symptoms: zod_1.z.array(exports.SymptomAnswerSchema).min(1),
    otherSymptomText: zod_1.z.string().optional(),
});
exports.TriagePreviewSchema = zod_1.z.object({
    triageAnswers: exports.TriageAnswersSchema,
});
exports.CreateVisitSchema = zod_1.z
    .object({
    serviceType: zod_1.z.enum(SERVICE_TYPE_VALUES).default('DOCTOR_VISIT'),
    reasonForVisit: zod_1.z.string().min(3),
    notes: zod_1.z.string().optional(),
    addressLine1: zod_1.z.string().min(1),
    addressLine2: zod_1.z.string().optional(),
    city: zod_1.z.string().min(1),
    state: zod_1.z.string().min(1),
    postalCode: zod_1.z.string().min(1),
    bookingFor: zod_1.z.enum(BOOKING_RELATION_VALUES).default('SELF'),
    patientName: zod_1.z.string().min(1).optional(),
    patientAge: zod_1.z.coerce.number().int().positive().optional(),
    patientSex: zod_1.z.string().optional(),
    caregiverName: zod_1.z.string().min(1).optional(),
    caregiverPhone: zod_1.z.string().min(7).optional(),
    // Required only for serviceType DOCTOR_VISIT — see superRefine below.
    // Optional here (rather than a discriminated union) so an old client
    // posting today's exact payload, with no serviceType field at all,
    // keeps behaving byte-identical to today.
    triageAnswers: exports.TriageAnswersSchema.optional(),
    redFlagAcknowledged: zod_1.z.boolean().default(false),
    // Required only for serviceType NURSING / PHYSIOTHERAPY respectively.
    nursingDetails: service_intake_1.NursingServiceDetailsSchema.optional(),
    physiotherapyDetails: service_intake_1.PhysiotherapyServiceDetailsSchema.optional(),
    safetyCheckAnswers: safety_net_1.SafetyNetAnswersSchema.optional(),
})
    .superRefine((data, ctx) => {
    if (data.bookingFor !== 'SELF') {
        if (!data.patientName) {
            ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, path: ['patientName'], message: 'Required when booking for someone else' });
        }
        if (!data.caregiverName) {
            ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, path: ['caregiverName'], message: 'Required when booking for someone else' });
        }
        if (!data.caregiverPhone) {
            ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, path: ['caregiverPhone'], message: 'Required when booking for someone else' });
        }
    }
    if (data.serviceType === 'DOCTOR_VISIT' && !data.triageAnswers) {
        ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, path: ['triageAnswers'], message: 'Required for a doctor visit request' });
    }
    if (data.serviceType === 'NURSING') {
        if (!data.nursingDetails) {
            ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, path: ['nursingDetails'], message: 'Required for a nursing request' });
        }
        if (!data.safetyCheckAnswers) {
            ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, path: ['safetyCheckAnswers'], message: 'Required for a nursing request' });
        }
    }
    if (data.serviceType === 'PHYSIOTHERAPY') {
        if (!data.physiotherapyDetails) {
            ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, path: ['physiotherapyDetails'], message: 'Required for a physiotherapy request' });
        }
        if (!data.safetyCheckAnswers) {
            ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, path: ['safetyCheckAnswers'], message: 'Required for a physiotherapy request' });
        }
    }
});
exports.AssignProviderSchema = zod_1.z
    .object({
    doctorId: zod_1.z.string().min(1).optional(),
    nurseId: zod_1.z.string().min(1).optional(),
    physiotherapistId: zod_1.z.string().min(1).optional(),
})
    .superRefine((data, ctx) => {
    const provided = [data.doctorId, data.nurseId, data.physiotherapistId].filter(Boolean);
    if (provided.length !== 1) {
        ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, message: 'Exactly one of doctorId, nurseId, or physiotherapistId is required' });
    }
});
const VISIT_STATUS_VALUES = Object.values(enums_1.VisitStatus);
exports.UpdateVisitStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(VISIT_STATUS_VALUES),
});
exports.CancelVisitSchema = zod_1.z.object({
    reason: zod_1.z.string().optional(),
});
