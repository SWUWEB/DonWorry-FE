import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { onboardingApi } from '../api/onboardingApi'
import type { UpdateOnboardingPayload } from '../api/onboardingApi'

const QUERY_KEYS = {
  detail: ['onboarding'] as const,
}

export function useOnboarding() {
  return useQuery({
    queryKey: QUERY_KEYS.detail,
    queryFn: onboardingApi.get,
  })
}

export function useUpdateOnboarding() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateOnboardingPayload) => onboardingApi.update(payload),
    onSuccess: (result) => {
      queryClient.setQueryData(QUERY_KEYS.detail, result)
    },
  })
}
