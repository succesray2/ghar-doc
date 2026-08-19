import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  LoginInput,
  SignupPatientInput,
  SignupDoctorInput,
  UserDto,
  AuthResponseMobileDto,
} from '@ghar-doc/shared';
import { apiClient } from '../lib/api-client';
import { getStoredRefreshToken, useAuthStore } from '../lib/auth-store';

interface RefreshResponse {
  accessToken: string | null;
  refreshToken?: string;
  user: UserDto | null;
}

// Mirrors apps/web/src/hooks/useAuth.ts's useSessionBootstrap, except RN can
// short-circuit: web always calls /auth/refresh on boot because it might have
// an httpOnly cookie it can't see; here we can check SecureStore first and
// skip the network round-trip entirely when there's nothing stored.
export function useSessionBootstrap() {
  const setSession = useAuthStore((s) => s.setSession);
  const clearSession = useAuthStore((s) => s.clearSession);

  return useQuery({
    queryKey: ['auth', 'bootstrap'],
    queryFn: async () => {
      const stored = await getStoredRefreshToken();
      if (!stored) {
        clearSession();
        return { accessToken: null, user: null } satisfies RefreshResponse;
      }
      const { data } = await apiClient.post<RefreshResponse>('/auth/refresh', {
        refreshToken: stored,
      });
      if (data.accessToken && data.user) {
        setSession(data.accessToken, data.user, data.refreshToken);
      } else {
        clearSession();
      }
      return data;
    },
    retry: false,
    staleTime: Infinity,
  });
}

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: async (input: LoginInput) => {
      const { data } = await apiClient.post<AuthResponseMobileDto>('/auth/login', input);
      return data;
    },
    onSuccess: (data) => {
      setSession(data.accessToken, data.user, data.refreshToken);
    },
  });
}

export function useSignupPatient() {
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: async (input: SignupPatientInput) => {
      const { data } = await apiClient.post<AuthResponseMobileDto>('/auth/signup/patient', input);
      return data;
    },
    onSuccess: (data) => {
      setSession(data.accessToken, data.user, data.refreshToken);
    },
  });
}

export function useSignupDoctor() {
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: async (input: SignupDoctorInput) => {
      const { data } = await apiClient.post<AuthResponseMobileDto>('/auth/signup/doctor', input);
      return data;
    },
    onSuccess: (data) => {
      setSession(data.accessToken, data.user, data.refreshToken);
    },
  });
}

export function useLogout() {
  const clearSession = useAuthStore((s) => s.clearSession);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const refreshToken = await getStoredRefreshToken();
      await apiClient.post('/auth/logout', { refreshToken });
    },
    onSuccess: () => {
      clearSession();
      queryClient.clear();
    },
  });
}
