import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  AdminCreatePhysiotherapistInput,
  PhysiotherapistListItemDto,
  PhysiotherapistStatus,
  PhysiotherapistStatusEventDto,
} from '@ghar-doc/shared';
import { apiClient } from '../lib/api-client';

export function usePhysiotherapists(status?: PhysiotherapistStatus) {
  return useQuery({
    queryKey: ['physiotherapists', 'all', status ?? 'ALL'],
    queryFn: async () => {
      const { data } = await apiClient.get<PhysiotherapistListItemDto[]>('/physiotherapists', {
        params: status ? { status } : undefined,
      });
      return data;
    },
  });
}

export function usePhysiotherapistStatusHistory(physiotherapistId: string | null) {
  return useQuery({
    queryKey: ['physiotherapists', 'status-history', physiotherapistId],
    queryFn: async () => {
      const { data } = await apiClient.get<PhysiotherapistStatusEventDto[]>(`/physiotherapists/${physiotherapistId}/status-history`);
      return data;
    },
    enabled: !!physiotherapistId,
  });
}

export function useCreatePhysiotherapist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: AdminCreatePhysiotherapistInput) => {
      const { data } = await apiClient.post<PhysiotherapistListItemDto>('/physiotherapists', input);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['physiotherapists'] }),
  });
}

export function useUpdatePhysiotherapistStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, reason }: { id: string; status: PhysiotherapistStatus; reason?: string }) => {
      const { data } = await apiClient.patch<PhysiotherapistListItemDto>(`/physiotherapists/${id}/status`, { status, reason });
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['physiotherapists'] }),
  });
}
