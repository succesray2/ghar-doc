import { z } from 'zod';
import { FamilyRelation } from './enums';

const FAMILY_RELATION_VALUES = Object.values(FamilyRelation) as [string, ...string[]];

export const CreateFamilyMemberSchema = z.object({
  name: z.string().min(1),
  relation: z.enum(FAMILY_RELATION_VALUES as [FamilyRelation, ...FamilyRelation[]]),
  age: z.coerce.number().int().positive().optional(),
  phone: z.string().min(7).optional(),
});
export type CreateFamilyMemberInput = z.infer<typeof CreateFamilyMemberSchema>;

export const UpdateFamilyMemberSchema = CreateFamilyMemberSchema;
export type UpdateFamilyMemberInput = z.infer<typeof UpdateFamilyMemberSchema>;
