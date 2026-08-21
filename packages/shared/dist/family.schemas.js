"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFamilyMemberSchema = exports.CreateFamilyMemberSchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("./enums");
const FAMILY_RELATION_VALUES = Object.values(enums_1.FamilyRelation);
exports.CreateFamilyMemberSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    relation: zod_1.z.enum(FAMILY_RELATION_VALUES),
    age: zod_1.z.coerce.number().int().positive().optional(),
    phone: zod_1.z.string().min(7).optional(),
});
exports.UpdateFamilyMemberSchema = exports.CreateFamilyMemberSchema;
