import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type ChangePasswordInput, type SessionDto, type UpdateProfileInput, type UserDto } from '@ghar-doc/shared';
import { apiClient } from '../lib/api-client';
import { useAuthStore } from '../lib/auth-store';

// Real endpoint (PATCH /users/me exists on the API) — unlike most of the
// Account section, this one actually persists.
export function useUpdateProfile() {
  const setSession = useAuthStore((s) => s.setSession);
  const accessToken = useAuthStore((s) => s.accessToken);

  return useMutation({
    mutationFn: async (input: UpdateProfileInput) => {
      const { data } = await apiClient.patch<UserDto>('/users/me', input);
      return data;
    },
    onSuccess: (user) => {
      if (accessToken) setSession(accessToken, user);
    },
  });
}

export function useSessions() {
  return useQuery({
    queryKey: ['auth', 'sessions'],
    queryFn: async () => {
      const { data } = await apiClient.get<SessionDto[]>('/auth/sessions');
      return data;
    },
  });
}

export function useLogoutAllDevices() {
  const clearSession = useAuthStore((s) => s.clearSession);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient.post('/auth/logout-all');
    },
    onSuccess: () => {
      clearSession();
      queryClient.clear();
    },
  });
}

export function useChangePassword() {
  const clearSession = useAuthStore((s) => s.clearSession);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ChangePasswordInput) => {
      await apiClient.patch('/auth/password', input);
    },
    onSuccess: () => {
      // changePassword() revokes every session server-side, including this one.
      clearSession();
      queryClient.clear();
    },
  });
}
