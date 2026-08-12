import { useEffect, useReducer } from 'react'
import { consumptionReportApi, type ConsumptionReportDetail } from '../api/consumptionReportApi'

type State = {
  data: ConsumptionReportDetail | null
  loading: boolean
  error: Error | null
}

type Action =
  | { type: 'loading' }
  | { type: 'success'; data: ConsumptionReportDetail }
  | { type: 'error'; error: Error }

function reducer(_: State, action: Action): State {
  if (action.type === 'loading') return { data: null, loading: true, error: null }
  if (action.type === 'success') return { data: action.data, loading: false, error: null }
  return { data: null, loading: false, error: action.error }
}

export function useConsumptionReport(month?: string) {
  const [state, dispatch] = useReducer(reducer, { data: null, loading: true, error: null })

  useEffect(() => {
    dispatch({ type: 'loading' })
    consumptionReportApi
      .getDetail(month)
      .then((data) => dispatch({ type: 'success', data }))
      .catch((e: unknown) =>
        dispatch({ type: 'error', error: e instanceof Error ? e : new Error('조회 실패') }),
      )
  }, [month])

  return state
}
