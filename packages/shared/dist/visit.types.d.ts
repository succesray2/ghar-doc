import type { Role, VisitStatus, VisitPaymentStatus, DoctorStatus, PaymentStatus, TriagePriority, BookingRelation } from './enums';
import type { MatchedRedFlag } from './triage-rules';
export interface UserDto {
    id: string;
    email: string;
    role: Role;
    firstName: string;
    lastName: string;
    phone: string | null;
}
type VisitPartyDto = Pick<UserDto, 'id' | 'firstName' | 'lastName' | 'phone'>;
export interface TriageSummaryDto {
    priority: TriagePriority;
    matchedRedFlags: MatchedRedFlag[];
    symptomIds: string[];
}
export interface VisitDto {
    id: string;
    status: VisitStatus;
    paymentStatus: VisitPaymentStatus;
    priority: TriagePriority;
    bookingFor: BookingRelation;
    patientName: string | null;
    patientAge: number | null;
    patientSex: string | null;
    caregiverName: string | null;
    caregiverPhone: string | null;
    reasonForVisit: string;
    notes: string | null;
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    state: string;
    postalCode: string;
    patient: VisitPartyDto;
    doctor: VisitPartyDto | null;
    triageSummary: TriageSummaryDto | null;
    requestedAt: string;
    assignedAt: string | null;
    enRouteAt: string | null;
    inProgressAt: string | null;
    completedAt: string | null;
    cancelledAt: string | null;
    cancellationReason: string | null;
}
export interface SafetyStatsDto {
    byPriority: Record<TriagePriority, number>;
    cancelled: number;
    unassignedByPriority: Record<TriagePriority, number>;
}
export interface DoctorListItemDto {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    specialty: string;
    licenseNumber: string;
    yearsExperience: number | null;
    status: DoctorStatus;
    statusReason: string | null;
    isAvailable: boolean;
}
export interface DoctorStatusEventDto {
    id: string;
    fromStatus: DoctorStatus | null;
    toStatus: DoctorStatus;
    reason: string | null;
    changedById: string;
    createdAt: string;
}
export interface PaymentDto {
    id: string;
    visitId: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    createdAt: string;
}
export interface CreatePaymentOrderDto {
    orderId: string;
    amount: number;
    currency: string;
    keyId: string;
}
export interface AuthResponseDto {
    accessToken: string;
    user: UserDto;
}
/** What a mobile client (X-Client-Type: mobile) receives instead of AuthResponseDto — includes the
 *  refresh token in the body since native apps have no httpOnly-cookie jar to carry it implicitly. */
export interface AuthResponseMobileDto extends AuthResponseDto {
    refreshToken: string;
}
export {};
