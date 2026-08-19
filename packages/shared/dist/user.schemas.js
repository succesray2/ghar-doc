"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDoctorStatusSchema = exports.UpdateDoctorAvailabilitySchema = exports.UpdateProfileSchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("./enums");
exports.UpdateProfileSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1).optional(),
    lastName: zod_1.z.string().min(1).optional(),
    phone: zod_1.z.string().min(7).optional(),
});
exports.UpdateDoctorAvailabilitySchema = zod_1.z.object({
    isAvailable: zod_1.z.boolean(),
});
const DOCTOR_STATUS_VALUES = Object.values(enums_1.DoctorStatus);
exports.UpdateDoctorStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(DOCTOR_STATUS_VALUES),
    reason: zod_1.z.string().min(1).optional(),
});
