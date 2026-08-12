import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationApi } from '../api/notificationApi'

const QUERY_KEYS = {
  list: (type: string, sort: string) => ['notifications', type, sort] as const,
}

export function useNotifications(type = 'ALL', sort = 'LATEST') {
  return useQuery({
    queryKey: QUERY_KEYS.list(type, sort),
    queryFn: () => notificationApi.getList(type, sort),
    staleTime: 1000 * 60,
  })
}

export function useReadNotification() {
  return useMutation({ mutationFn: notificationApi.readOne })
}

export function useReadAllNotifications() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: notificationApi.readAll,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })
}
