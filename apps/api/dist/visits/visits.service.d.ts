import { VisitStatus, type CreateVisitInput, type TriageAnswersInput, type SafetyStatsDto } from '@ghar-doc/shared';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthenticatedUser } from '../auth/types';
export declare class VisitsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    previewTriage(answers: TriageAnswersInput): import("@ghar-doc/shared").TriageResult;
    create(patientId: string, input: CreateVisitInput): Promise<any>;
    findAll(status?: VisitStatus): Promise<any[]>;
    findMine(patientId: string): Promise<any[]>;
    findAssigned(doctorId: string): Promise<any[]>;
    findOneForUser(id: string, user: AuthenticatedUser): Promise<any>;
    assign(id: string, doctorId: string, actor: AuthenticatedUser): Promise<any>;
    updateStatus(id: string, status: VisitStatus, actor: AuthenticatedUser): Promise<any>;
    cancel(id: string, actor: AuthenticatedUser, reason?: string): Promise<any>;
    safetyStats(): Promise<SafetyStatsDto>;
    private transition;
    private getOrThrow;
    private assertCanView;
    private mapVisit;
}
