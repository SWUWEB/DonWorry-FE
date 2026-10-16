import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationApi } from '../api/notificationApi'
import type { NotificationSettingsResponse } from '../api/notificationApi'
import type { NotificationItem } from '../components/NotificationCard'

const QUERY_KEYS = {
  // 목록은 필터/정렬별로 나뉘므로 prefix 단위 무효화를 위해 'notifications'를 공유합니다.
  lists: ['notifications'] as const,
  list: (type: string, sort: string) => ['notifications', type, sort] as const,
  // 설정은 목록 무효화에 휩쓸리지 않도록 별도 prefix를 씁니다.
  settings: ['notification-settings'] as const,
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
    // 읽음 상태는 필터/정렬별 목록 캐시에 모두 걸쳐 있어 목록 prefix 단위로 무효화합니다.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists }),
  })
}

export function useDeleteNotification() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: notificationApi.deleteOne,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.lists })
      const snapshots = queryClient.getQueriesData<NotificationItem[]>({
        queryKey: QUERY_KEYS.lists,
      })
      queryClient.setQueriesData<NotificationItem[]>(
        { queryKey: QUERY_KEYS.lists },
        (old) => old?.filter((n) => n.id !== id) ?? [],
      )
      return { snapshots }
    },
    onError: (_, __, context) => {
      context?.snapshots.forEach(([key, data]) => queryClient.setQueryData(key, data))
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists }),
  })
}

export function useReadAllNotifications() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: notificationApi.readAll,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists }),
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
