import { useQuery } from '@tanstack/react-query'
import { reportApi } from '../api/reportApi'

export function useConsumptionReport(month: string) {
  return useQuery({
    queryKey: ['report', 'consumption-detail', month],
    queryFn: () => reportApi.getConsumptionDetail(month),
    staleTime: 1000 * 60 * 5,
  })
}
