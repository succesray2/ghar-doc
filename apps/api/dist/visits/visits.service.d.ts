import { VisitStatus, ServiceType, type CreateVisitInput, type TriageAnswersInput, type SafetyNetAnswers, type SafetyStatsDto } from '@ghar-doc/shared';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import type { AuthenticatedUser } from '../auth/types';
import type { RequestContext } from '../common/types/request-context';
export declare class VisitsService {
    private readonly prisma;
    private readonly notifications;
    private readonly logger;
    constructor(prisma: PrismaService, notifications: NotificationsService);
    previewTriage(answers: TriageAnswersInput): import("@ghar-doc/shared").TriageResult;
    previewSafetyNet(answers: SafetyNetAnswers): import("@ghar-doc/shared").SafetyNetResult;
    create(patientId: string, input: CreateVisitInput): Promise<any>;
    findAll(status?: VisitStatus, serviceType?: ServiceType): Promise<any[]>;
    findMine(patientId: string): Promise<any[]>;
    findAssigned(actor: AuthenticatedUser): Promise<any[]>;
    findOneForUser(id: string, user: AuthenticatedUser): Promise<any>;
    assign(id: string, providerId: string, actor: AuthenticatedUser, ctx?: RequestContext): Promise<any>;
    updateStatus(id: string, status: VisitStatus, actor: AuthenticatedUser, ctx?: RequestContext): Promise<any>;
    cancel(id: string, actor: AuthenticatedUser, reason?: string, ctx?: RequestContext): Promise<any>;
    safetyStats(): Promise<SafetyStatsDto>;
    private transition;
    private chainedTransition;
    private getOrThrow;
    private assertCanView;
    private mapVisit;
}
