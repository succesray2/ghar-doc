export { Role, VisitStatus, VisitPaymentStatus } from './enums';

export {
  LoginSchema,
  SignupPatientSchema,
  SignupDoctorSchema,
  type LoginInput,
  type SignupPatientInput,
  type SignupDoctorInput,
} from './auth.schemas';

export {
  UpdateProfileSchema,
  UpdateDoctorAvailabilitySchema,
  type UpdateProfileInput,
  type UpdateDoctorAvailabilityInput,
} from './user.schemas';

export {
  CreateVisitSchema,
  AssignDoctorSchema,
  UpdateVisitStatusSchema,
  CancelVisitSchema,
  type CreateVisitInput,
  type AssignDoctorInput,
  type UpdateVisitStatusInput,
  type CancelVisitInput,
} from './visit.schemas';

export type { UserDto, VisitDto, DoctorListItemDto, AuthResponseDto } from './visit.types';

export {
  VISIT_TRANSITIONS,
  getLegalTransitions,
  isTransitionAllowed,
  type VisitTransition,
} from './visit-transitions';
