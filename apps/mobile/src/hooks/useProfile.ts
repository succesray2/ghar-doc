import { useMutation } from '@tanstack/react-query';
import { type UpdateProfileInput, type UserDto } from '@ghar-doc/shared';
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
