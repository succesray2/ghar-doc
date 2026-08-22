"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePhysiotherapistStatusSchema = exports.UpdateNurseStatusSchema = exports.AdminCreatePhysiotherapistSchema = exports.AdminCreateNurseSchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("./enums");
// Nurse/Physiotherapist accounts are admin-created only — no public signup
// path exists (unlike SignupDoctorSchema), so these live here rather than
// in auth.schemas.ts.
// An HTML form's untouched optional text input submits '', not undefined --
// plain `z.string().min(7).optional()` rejects that empty string instead of
// treating it as "not provided". Coerce '' to undefined first.
const optionalPhone = zod_1.z.preprocess((v) => (v === '' ? undefined : v), zod_1.z.string().min(7).optional());
exports.AdminCreateNurseSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    firstName: zod_1.z.string().min(1),
    lastName: zod_1.z.string().min(1),
    phone: optionalPhone,
    licenseNumber: zod_1.z.string().min(1),
    qualification: zod_1.z.string().min(1),
    yearsExperience: zod_1.z.coerce.number().int().min(0).optional(),
    bio: zod_1.z.string().optional(),
});
exports.AdminCreatePhysiotherapistSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    firstName: zod_1.z.string().min(1),
    lastName: zod_1.z.string().min(1),
    phone: optionalPhone,
    licenseNumber: zod_1.z.string().min(1),
    specialty: zod_1.z.string().min(1),
    yearsExperience: zod_1.z.coerce.number().int().min(0).optional(),
    bio: zod_1.z.string().optional(),
});
const NURSE_STATUS_VALUES = Object.values(enums_1.NurseStatus);
exports.UpdateNurseStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(NURSE_STATUS_VALUES),
    reason: zod_1.z.string().min(1).optional(),
});
const PHYSIOTHERAPIST_STATUS_VALUES = Object.values(enums_1.PhysiotherapistStatus);
exports.UpdatePhysiotherapistStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(PHYSIOTHERAPIST_STATUS_VALUES),
    reason: zod_1.z.string().min(1).optional(),
});
