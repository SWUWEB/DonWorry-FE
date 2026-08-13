import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationApi } from '../api/notificationApi'
import type { NotificationSettingsResponse } from '../api/notificationApi'

const QUERY_KEYS = {
  list: (type: string, sort: string) => ['notifications', type, sort] as const,
  settings: ['notifications', 'settings'] as const,
}

export function useNotifications(type = 'ALL', sort = 'LATEST') {
  return useQuery({
    queryKey: QUERY_KEYS.list(type, sort),
    queryFn: () => notificationApi.getList(type, sort),
    staleTime: 1000 * 60,
  })
}

export function useReadNotification() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: notificationApi.readOne,
    // 읽음 상태는 필터/정렬별 목록 캐시에 모두 걸쳐 있어 prefix 단위로 무효화합니다.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })
}

export function useReadAllNotifications() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: notificationApi.readAll,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })
}

export function useNotificationSettings() {
  return useQuery({
    queryKey: QUERY_KEYS.settings,
    queryFn: notificationApi.getSettings,
    staleTime: 1000 * 60 * 5,
  })
}

// 전체 알림(notifyPushEnabled)과 세부 알림은 같은 요청에 함께 담을 수 없어 훅을 나눠 둡니다.
export function useUpdateAllSetting() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: notificationApi.updateAllSetting,
    onSuccess: (settings) => {
      queryClient.setQueryData(QUERY_KEYS.settings, settings)
    },
  })
}

export function useUpdateSubSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (settings: Omit<NotificationSettingsResponse, 'all'>) =>
      notificationApi.updateSubSettings(settings),
    onSuccess: (settings) => {
      queryClient.setQueryData(QUERY_KEYS.settings, settings)
    },
  })
}
