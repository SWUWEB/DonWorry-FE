import { useQuery } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { consumptionRecordApi } from '../api/consumptionRecordApi'
import type { RecordListFilter } from '../api/consumptionRecordApi'

const QUERY_KEYS = {
  list: (filter: RecordListFilter) => ['consumption-records', 'list', filter] as const,
  detail: (id: string) => ['consumption-records', 'detail', id] as const,
}

export function useConsumptionRecords(filter: RecordListFilter = 'all') {
  return useQuery({
    queryKey: QUERY_KEYS.list(filter),
    queryFn: () => consumptionRecordApi.getList(filter),
    staleTime: 1000 * 60,
  })
}

export function useConsumptionRecordDetail(id: string | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.detail(id ?? ''),
    queryFn: () => consumptionRecordApi.getDetail(id as string),
    enabled: Boolean(id),
    staleTime: 1000 * 60,
    retry: (failureCount, err) => {
      if (isAxiosError(err) && err.response?.status === 404) return false
      return failureCount < 3
    },
  })
}
