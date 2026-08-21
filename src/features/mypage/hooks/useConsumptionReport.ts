import { useQuery } from '@tanstack/react-query'
import { getCurrentYearMonth } from '@/shared/utils/date'
import { consumptionReportApi } from '../api/consumptionReportApi'

const QUERY_KEYS = {
  detail: (month: string) => ['consumption-report', 'detail', month] as const,
}

export function useConsumptionReport(month?: string) {
  const reportMonth = month ?? getCurrentYearMonth()

  return useQuery({
    queryKey: QUERY_KEYS.detail(reportMonth),
    queryFn: () => consumptionReportApi.getDetail(reportMonth),
    staleTime: 1000 * 60 * 5,
  })
}
