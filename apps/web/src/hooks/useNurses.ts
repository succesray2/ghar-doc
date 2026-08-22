import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AdminCreateNurseInput, NurseListItemDto, NurseStatus, NurseStatusEventDto } from '@ghar-doc/shared';
import { apiClient } from '../lib/api-client';

export function useNurses(status?: NurseStatus) {
  return useQuery({
    queryKey: ['nurses', 'all', status ?? 'ALL'],
    queryFn: async () => {
      const { data } = await apiClient.get<NurseListItemDto[]>('/nurses', {
        params: status ? { status } : undefined,
      });
      return data;
    },
  });
}

export function useNurseStatusHistory(nurseId: string | null) {
  return useQuery({
    queryKey: ['nurses', 'status-history', nurseId],
    queryFn: async () => {
      const { data } = await apiClient.get<NurseStatusEventDto[]>(`/nurses/${nurseId}/status-history`);
      return data;
    },
    enabled: !!nurseId,
  });
}

export function useCreateNurse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: AdminCreateNurseInput) => {
      const { data } = await apiClient.post<NurseListItemDto>('/nurses', input);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['nurses'] }),
  });
}

export function useUpdateNurseStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, reason }: { id: string; status: NurseStatus; reason?: string }) => {
      const { data } = await apiClient.patch<NurseListItemDto>(`/nurses/${id}/status`, { status, reason });
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['nurses'] }),
  });
}
