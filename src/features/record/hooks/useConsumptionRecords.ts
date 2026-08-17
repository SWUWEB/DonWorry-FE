import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { consumptionRecordApi } from '../api/consumptionRecordApi'
import type { ConsumptionRecordInput, RecordListFilter } from '../api/consumptionRecordApi'

const QUERY_KEYS = {
  list: (filter: RecordListFilter) => ['consumption-records', 'list', filter] as const,
  detail: (id: string) => ['consumption-records', 'detail', id] as const,
  ratio: ['consumption-records', 'ratio'] as const,
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

export function useConsumptionRatio() {
  return useQuery({
    queryKey: QUERY_KEYS.ratio,
    queryFn: consumptionRecordApi.getRatio,
    staleTime: 1000 * 60,
  })
}

export function useCreateConsumptionRecord() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: consumptionRecordApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consumption-records'] })
    },
  })
}

export function useUpdateConsumptionRecord() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ConsumptionRecordInput }) =>
      consumptionRecordApi.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consumption-records'] })
    },
  })
}

export function useDeleteConsumptionRecord() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: consumptionRecordApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consumption-records'] })
    },
  })
}
