import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type { LoginInput, SignupPatientInput, SignupDoctorInput, UserDto, AuthResponseDto } from '@ghar-doc/shared';
import { apiClient } from '../lib/api-client';
import { useAuthStore } from '../lib/auth-store';

interface RefreshResponse {
  accessToken: string | null;
  user: UserDto | null;
}

export function useSessionBootstrap() {
  const setSession = useAuthStore((s) => s.setSession);
  const clearSession = useAuthStore((s) => s.clearSession);

  return useQuery({
    queryKey: ['auth', 'bootstrap'],
    queryFn: async () => {
      const { data } = await apiClient.post<RefreshResponse>('/auth/refresh');
      if (data.accessToken && data.user) {
        setSession(data.accessToken, data.user);
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
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (input: LoginInput) => {
      const { data } = await apiClient.post<AuthResponseDto>('/auth/login', input);
      return data;
    },
    onSuccess: (data) => {
      setSession(data.accessToken, data.user);
      navigate(homeForRole(data.user.role));
    },
  });
}

export function useSignupPatient() {
  const setSession = useAuthStore((s) => s.setSession);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (input: SignupPatientInput) => {
      const { data } = await apiClient.post<AuthResponseDto>('/auth/signup/patient', input);
      return data;
    },
    onSuccess: (data) => {
      setSession(data.accessToken, data.user);
      navigate(homeForRole(data.user.role));
    },
  });
}

export function useSignupDoctor() {
  const setSession = useAuthStore((s) => s.setSession);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (input: SignupDoctorInput) => {
      const { data } = await apiClient.post<AuthResponseDto>('/auth/signup/doctor', input);
      return data;
    },
    onSuccess: (data) => {
      setSession(data.accessToken, data.user);
      navigate(homeForRole(data.user.role));
    },
  });
}

export function useLogout() {
  const clearSession = useAuthStore((s) => s.clearSession);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      await apiClient.post('/auth/logout');
    },
    onSuccess: () => {
      clearSession();
      queryClient.clear();
      navigate('/login');
    },
  });
}

export function homeForRole(role: UserDto['role']): string {
  switch (role) {
    case 'ADMIN':
      return '/admin/visits';
    case 'DOCTOR':
      return '/doctor/visits';
    default:
      return '/patient/visits';
  }
}
