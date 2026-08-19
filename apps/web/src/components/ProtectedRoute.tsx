import { Navigate, Outlet } from 'react-router-dom';
import type { Role } from '@ghar-doc/shared';
import { useAuthStore } from '../lib/auth-store';
import { homeForRole } from '../hooks/useAuth';

export function ProtectedRoute({ allow }: { allow: Role[] }) {
  const { user, accessToken } = useAuthStore();

  if (!accessToken || !user) {
    return <Navigate to="/login" replace />;
  }
  if (!allow.includes(user.role)) {
    return <Navigate to={homeForRole(user.role)} replace />;
  }
  return <Outlet />;
}
