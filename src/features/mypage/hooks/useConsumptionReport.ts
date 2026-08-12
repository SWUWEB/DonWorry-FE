import { useState, useEffect } from 'react'
import { consumptionReportApi, type ConsumptionReportDetail } from '../api/consumptionReportApi'

export function useConsumptionReport(month?: string) {
  const [data, setData] = useState<ConsumptionReportDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    consumptionReportApi
      .getDetail(month)
      .then(setData)
      .catch((e: unknown) => setError(e instanceof Error ? e : new Error('조회 실패')))
      .finally(() => setLoading(false))
  }, [month])

  return { data, loading, error }
}
