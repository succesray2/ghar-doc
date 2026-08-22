import type { Request } from 'express';
import { type VisitStatus, type ServiceType, type CreateVisitInput, type AssignProviderInput, type UpdateVisitStatusInput, type CancelVisitInput, type TriagePreviewInput, type SafetyNetPreviewInput } from '@ghar-doc/shared';
import { VisitsService } from './visits.service';
import type { AuthenticatedUser } from '../auth/types';
export declare class VisitsController {
    private readonly visitsService;
    constructor(visitsService: VisitsService);
    create(user: AuthenticatedUser, body: CreateVisitInput): Promise<any>;
    previewTriage(body: TriagePreviewInput): import("@ghar-doc/shared").TriageResult;
    previewSafetyNet(body: SafetyNetPreviewInput): import("@ghar-doc/shared").SafetyNetResult;
    findAll(status?: VisitStatus, serviceType?: ServiceType): Promise<any[]>;
    findMine(user: AuthenticatedUser): Promise<any[]>;
    findAssigned(user: AuthenticatedUser): Promise<any[]>;
    safetyStats(): Promise<import("@ghar-doc/shared").SafetyStatsDto>;
    findOne(id: string, user: AuthenticatedUser): Promise<any>;
    assign(id: string, body: AssignProviderInput, user: AuthenticatedUser, req: Request): Promise<any>;
    updateStatus(id: string, body: UpdateVisitStatusInput, user: AuthenticatedUser, req: Request): Promise<any>;
    cancel(id: string, body: CancelVisitInput, user: AuthenticatedUser, req: Request): Promise<any>;
}
