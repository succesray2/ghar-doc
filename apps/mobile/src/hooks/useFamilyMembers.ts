import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateFamilyMemberInput, FamilyMemberDto, UpdateFamilyMemberInput } from '@ghar-doc/shared';
import { apiClient } from '../lib/api-client';

export function useFamilyMembers() {
  return useQuery({
    queryKey: ['family-members'],
    queryFn: async () => {
      const { data } = await apiClient.get<FamilyMemberDto[]>('/family-members');
      return data;
    },
  });
}

export function useCreateFamilyMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateFamilyMemberInput) => {
      const { data } = await apiClient.post<FamilyMemberDto>('/family-members', input);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['family-members'] }),
  });
}

export function useUpdateFamilyMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: UpdateFamilyMemberInput }) => {
      const { data } = await apiClient.patch<FamilyMemberDto>(`/family-members/${id}`, input);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['family-members'] }),
  });
}

export function useDeleteFamilyMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/family-members/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['family-members'] }),
  });
}
