"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelVisitSchema = exports.UpdateVisitStatusSchema = exports.AssignDoctorSchema = exports.CreateVisitSchema = exports.TriagePreviewSchema = exports.TriageAnswersSchema = exports.SymptomAnswerSchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("./enums");
const triage_rules_1 = require("./triage-rules");
const DURATION_VALUES = Object.values(triage_rules_1.DurationOption);
const SEVERITY_VALUES = Object.values(triage_rules_1.SeverityOption);
const BOOKING_RELATION_VALUES = Object.values(enums_1.BookingRelation);
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
    triageAnswers: exports.TriageAnswersSchema,
    redFlagAcknowledged: zod_1.z.boolean().default(false),
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
});
exports.AssignDoctorSchema = zod_1.z.object({
    doctorId: zod_1.z.string().min(1),
});
const VISIT_STATUS_VALUES = Object.values(enums_1.VisitStatus);
exports.UpdateVisitStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(VISIT_STATUS_VALUES),
});
exports.CancelVisitSchema = zod_1.z.object({
    reason: zod_1.z.string().optional(),
});
