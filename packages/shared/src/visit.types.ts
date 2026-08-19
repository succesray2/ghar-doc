import type { Role, VisitStatus, VisitPaymentStatus } from './enums';

export interface UserDto {
  id: string;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
  phone: string | null;
}

type VisitPartyDto = Pick<UserDto, 'id' | 'firstName' | 'lastName' | 'phone'>;

export interface VisitDto {
  id: string;
  status: VisitStatus;
  paymentStatus: VisitPaymentStatus;
  reasonForVisit: string;
  notes: string | null;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  patient: VisitPartyDto;
  doctor: VisitPartyDto | null;
  requestedAt: string;
  assignedAt: string | null;
  enRouteAt: string | null;
  inProgressAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  cancellationReason: string | null;
}

export interface DoctorListItemDto {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
  isApproved: boolean;
  isAvailable: boolean;
}

export interface AuthResponseDto {
  accessToken: string;
  user: UserDto;
}
