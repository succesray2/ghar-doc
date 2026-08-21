import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { NotificationDto, NotificationPreferencesDto, UpdateNotificationPreferencesInput } from '@ghar-doc/shared';
import { apiClient } from '../lib/api-client';

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data } = await apiClient.get<NotificationDto[]>('/notifications');
      return data;
    },
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.patch<NotificationDto>(`/notifications/${id}/read`);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });
}

export function useNotificationPreferences() {
  return useQuery({
    queryKey: ['notifications', 'preferences'],
    queryFn: async () => {
      const { data } = await apiClient.get<NotificationPreferencesDto>('/notifications/preferences');
      return data;
    },
  });
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (patch: UpdateNotificationPreferencesInput) => {
      const { data } = await apiClient.patch<NotificationPreferencesDto>('/notifications/preferences', patch);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications', 'preferences'] }),
  });
}
