import { useQuery } from '@tanstack/react-query'
import { homeApi } from '../api/homeApi'

export function useHomeData() {
  return useQuery({
    queryKey: ['home'],
    queryFn: homeApi.getHomeData,
    staleTime: 1000 * 60,
  })
}
