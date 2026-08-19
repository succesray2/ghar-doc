import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { DoctorListItemDto, VisitDto } from '@ghar-doc/shared';
import { apiClient } from '../lib/api-client';

export function useAssignableDoctors() {
  return useQuery({
    queryKey: ['doctors', 'assignable'],
    queryFn: async () => {
      const { data } = await apiClient.get<DoctorListItemDto[]>('/doctors', {
        params: { isApproved: true, isAvailable: true },
      });
      return data;
    },
  });
}

export function useAssignDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ visitId, doctorId }: { visitId: string; doctorId: string }) => {
      const { data } = await apiClient.patch<VisitDto>(`/visits/${visitId}/assign`, { doctorId });
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['visits'] }),
  });
}
