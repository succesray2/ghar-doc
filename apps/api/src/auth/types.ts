import type { Role } from '@ghar-doc/shared';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: Role;
}
