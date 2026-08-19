"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelVisitSchema = exports.UpdateVisitStatusSchema = exports.AssignDoctorSchema = exports.CreateVisitSchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("./enums");
exports.CreateVisitSchema = zod_1.z.object({
    reasonForVisit: zod_1.z.string().min(3),
    notes: zod_1.z.string().optional(),
    addressLine1: zod_1.z.string().min(1),
    addressLine2: zod_1.z.string().optional(),
    city: zod_1.z.string().min(1),
    state: zod_1.z.string().min(1),
    postalCode: zod_1.z.string().min(1),
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
