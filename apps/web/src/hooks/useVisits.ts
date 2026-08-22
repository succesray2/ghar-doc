import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  CreateVisitInput,
  SafetyNetAnswers,
  SafetyNetResult,
  SafetyStatsDto,
  ServiceType,
  TriageAnswersInput,
  TriageResult,
  VisitDto,
  VisitStatus,
} from '@ghar-doc/shared';
import { apiClient } from '../lib/api-client';

export function useMyVisits() {
  return useQuery({
    queryKey: ['visits', 'mine'],
    queryFn: async () => {
      const { data } = await apiClient.get<VisitDto[]>('/visits/mine');
      return data;
    },
    refetchInterval: 8000,
  });
}

export function useAssignedVisits() {
  return useQuery({
    queryKey: ['visits', 'assigned'],
    queryFn: async () => {
      const { data } = await apiClient.get<VisitDto[]>('/visits/assigned');
      return data;
    },
    refetchInterval: 8000,
  });
}

export function useAllVisits(status?: VisitStatus, serviceType?: ServiceType) {
  return useQuery({
    queryKey: ['visits', 'all', status ?? 'ALL', serviceType ?? 'ALL'],
    queryFn: async () => {
      const { data } = await apiClient.get<VisitDto[]>('/visits', { params: { status, serviceType } });
      return data;
    },
    refetchInterval: 8000,
  });
}

export function useTriagePreview() {
  return useMutation({
    mutationFn: async (triageAnswers: TriageAnswersInput) => {
      const { data } = await apiClient.post<TriageResult>('/visits/triage-preview', { triageAnswers });
      return data;
    },
  });
}

export function useSafetyNetPreview() {
  return useMutation({
    mutationFn: async (safetyCheckAnswers: SafetyNetAnswers) => {
      const { data } = await apiClient.post<SafetyNetResult>('/visits/safety-check-preview', { safetyCheckAnswers });
      return data;
    },
  });
}

export function useSafetyStats() {
  return useQuery({
    queryKey: ['visits', 'safety-stats'],
    queryFn: async () => {
      const { data } = await apiClient.get<SafetyStatsDto>('/visits/safety-stats');
      return data;
    },
  });
}

export function useCreateVisit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateVisitInput) => {
      const { data } = await apiClient.post<VisitDto>('/visits', input);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['visits'] }),
  });
}

export function useUpdateVisitStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: VisitStatus }) => {
      const { data } = await apiClient.patch<VisitDto>(`/visits/${id}/status`, { status });
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['visits'] }),
  });
}

export function useCancelVisit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      const { data } = await apiClient.patch<VisitDto>(`/visits/${id}/cancel`, { reason });
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['visits'] }),
  });
}
