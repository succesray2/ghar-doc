import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { DoctorListItemDto, NurseListItemDto, PhysiotherapistListItemDto, VisitDto } from '@ghar-doc/shared';
import { apiClient } from '../lib/api-client';

export function useAssignableDoctors() {
  return useQuery({
    queryKey: ['doctors', 'assignable'],
    queryFn: async () => {
      const { data } = await apiClient.get<DoctorListItemDto[]>('/doctors', {
        params: { status: 'APPROVED', isAvailable: true },
      });
      return data;
    },
  });
}

export function useAssignableNurses() {
  return useQuery({
    queryKey: ['nurses', 'assignable'],
    queryFn: async () => {
      const { data } = await apiClient.get<NurseListItemDto[]>('/nurses', { params: { status: 'ACTIVE' } });
      return data;
    },
  });
}

export function useAssignablePhysiotherapists() {
  return useQuery({
    queryKey: ['physiotherapists', 'assignable'],
    queryFn: async () => {
      const { data } = await apiClient.get<PhysiotherapistListItemDto[]>('/physiotherapists', { params: { status: 'ACTIVE' } });
      return data;
    },
  });
}

/** One assignment endpoint, keyed by whichever provider type the visit's
 *  serviceType calls for -- the caller passes exactly one of
 *  doctorId/nurseId/physiotherapistId, matching AssignProviderSchema. */
export function useAssignProvider() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      visitId,
      doctorId,
      nurseId,
      physiotherapistId,
    }: {
      visitId: string;
      doctorId?: string;
      nurseId?: string;
      physiotherapistId?: string;
    }) => {
      const { data } = await apiClient.patch<VisitDto>(`/visits/${visitId}/assign`, { doctorId, nurseId, physiotherapistId });
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['visits'] }),
  });
}
