import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { DoctorListItemDto, DoctorStatus, DoctorStatusEventDto } from '@ghar-doc/shared';
import { apiClient } from '../lib/api-client';

export function useDoctors(status?: DoctorStatus) {
  return useQuery({
    queryKey: ['doctors', 'all', status ?? 'ALL'],
    queryFn: async () => {
      const { data } = await apiClient.get<DoctorListItemDto[]>('/doctors', {
        params: status ? { status } : undefined,
      });
      return data;
    },
  });
}

export function useDoctorStatusHistory(doctorId: string | null) {
  return useQuery({
    queryKey: ['doctors', 'status-history', doctorId],
    queryFn: async () => {
      const { data } = await apiClient.get<DoctorStatusEventDto[]>(`/doctors/${doctorId}/status-history`);
      return data;
    },
    enabled: !!doctorId,
  });
}

export function useUpdateDoctorStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, reason }: { id: string; status: DoctorStatus; reason?: string }) => {
      const { data } = await apiClient.patch<DoctorListItemDto>(`/doctors/${id}/status`, { status, reason });
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['doctors'] }),
  });
}
