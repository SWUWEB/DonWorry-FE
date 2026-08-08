import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationApi } from '../api/notificationApi'
import type { NotificationSettingsResponse } from '../api/notificationApi'

const QUERY_KEYS = {
  list: ['notifications'] as const,
  settings: ['notifications', 'settings'] as const,
}

export function useNotifications() {
  return useQuery({
    queryKey: QUERY_KEYS.list,
    queryFn: notificationApi.getList,
    staleTime: 1000 * 60,
  })
}

export function useDeleteNotification() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: notificationApi.deleteOne,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.list }),
  })
}

export function useNotificationSettings() {
  return useQuery({
    queryKey: QUERY_KEYS.settings,
    queryFn: notificationApi.getSettings,
    staleTime: 1000 * 60 * 5,
  })
}

export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (settings: NotificationSettingsResponse) =>
      notificationApi.updateSettings(settings),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.settings }),
  })
}
