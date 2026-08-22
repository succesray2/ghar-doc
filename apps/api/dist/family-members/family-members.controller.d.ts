import { type CreateFamilyMemberInput, type UpdateFamilyMemberInput } from '@ghar-doc/shared';
import { FamilyMembersService } from './family-members.service';
import type { AuthenticatedUser } from '../auth/types';
export declare class FamilyMembersController {
    private readonly familyMembersService;
    constructor(familyMembersService: FamilyMembersService);
    findMine(user: AuthenticatedUser): Promise<{
        id: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        userId: string;
        relation: import("@prisma/client").$Enums.FamilyRelation;
        age: number | null;
    }[]>;
    create(user: AuthenticatedUser, body: CreateFamilyMemberInput): Promise<{
        id: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        userId: string;
        relation: import("@prisma/client").$Enums.FamilyRelation;
        age: number | null;
    }>;
    update(id: string, user: AuthenticatedUser, body: UpdateFamilyMemberInput): Promise<{
        id: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        userId: string;
        relation: import("@prisma/client").$Enums.FamilyRelation;
        age: number | null;
    }>;
    remove(id: string, user: AuthenticatedUser): Promise<void>;
}
