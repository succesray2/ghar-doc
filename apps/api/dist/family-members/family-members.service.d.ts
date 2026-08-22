import type { CreateFamilyMemberInput, UpdateFamilyMemberInput } from '@ghar-doc/shared';
import { PrismaService } from '../prisma/prisma.service';
export declare class FamilyMembersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findMine(userId: string): Promise<{
        id: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        userId: string;
        relation: import("@prisma/client").$Enums.FamilyRelation;
        age: number | null;
    }[]>;
    create(userId: string, input: CreateFamilyMemberInput): Promise<{
        id: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        userId: string;
        relation: import("@prisma/client").$Enums.FamilyRelation;
        age: number | null;
    }>;
    update(id: string, userId: string, input: UpdateFamilyMemberInput): Promise<{
        id: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        userId: string;
        relation: import("@prisma/client").$Enums.FamilyRelation;
        age: number | null;
    }>;
    remove(id: string, userId: string): Promise<void>;
    private assertOwned;
}
