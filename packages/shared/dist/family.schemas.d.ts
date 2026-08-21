import { z } from 'zod';
import { FamilyRelation } from './enums';
export declare const CreateFamilyMemberSchema: z.ZodObject<{
    name: z.ZodString;
    relation: z.ZodEnum<[FamilyRelation, ...FamilyRelation[]]>;
    age: z.ZodOptional<z.ZodNumber>;
    phone: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    relation: FamilyRelation;
    phone?: string | undefined;
    age?: number | undefined;
}, {
    name: string;
    relation: FamilyRelation;
    phone?: string | undefined;
    age?: number | undefined;
}>;
export type CreateFamilyMemberInput = z.infer<typeof CreateFamilyMemberSchema>;
export declare const UpdateFamilyMemberSchema: z.ZodObject<{
    name: z.ZodString;
    relation: z.ZodEnum<[FamilyRelation, ...FamilyRelation[]]>;
    age: z.ZodOptional<z.ZodNumber>;
    phone: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    relation: FamilyRelation;
    phone?: string | undefined;
    age?: number | undefined;
}, {
    name: string;
    relation: FamilyRelation;
    phone?: string | undefined;
    age?: number | undefined;
}>;
export type UpdateFamilyMemberInput = z.infer<typeof UpdateFamilyMemberSchema>;
