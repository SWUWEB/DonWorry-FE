import { useQuery } from '@tanstack/react-query'
import { consumptionReportApi } from '../api/consumptionReportApi'

const QUERY_KEYS = {
  detail: (month?: string) => ['consumption-report', 'detail', month ?? 'current'] as const,
}

export function useConsumptionReport(month?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.detail(month),
    queryFn: () => consumptionReportApi.getDetail(month),
    staleTime: 1000 * 60 * 5,
  })
}
