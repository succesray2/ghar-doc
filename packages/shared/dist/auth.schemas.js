"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangePasswordSchema = exports.RefreshSchema = exports.SignupDoctorSchema = exports.SignupPatientSchema = exports.LoginSchema = void 0;
const zod_1 = require("zod");
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
});
exports.SignupPatientSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    firstName: zod_1.z.string().min(1),
    lastName: zod_1.z.string().min(1),
    phone: zod_1.z.string().min(7).optional(),
    addressLine1: zod_1.z.string().min(1),
    addressLine2: zod_1.z.string().optional(),
    city: zod_1.z.string().min(1),
    state: zod_1.z.string().min(1),
    postalCode: zod_1.z.string().min(1),
});
exports.SignupDoctorSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    firstName: zod_1.z.string().min(1),
    lastName: zod_1.z.string().min(1),
    phone: zod_1.z.string().min(7).optional(),
    licenseNumber: zod_1.z.string().min(1),
    specialty: zod_1.z.string().min(1),
    yearsExperience: zod_1.z.coerce.number().int().min(0).optional(),
    bio: zod_1.z.string().optional(),
});
exports.RefreshSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().optional(),
});
exports.ChangePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(8),
    newPassword: zod_1.z.string().min(8),
});
