import { useMutation, useQuery } from '@tanstack/react-query'
import { interventionApi } from '../api/interventionApi'
import type { InterventionAnswer } from '../api/interventionApi'

export function useInterventionQuestions(category: string | undefined) {
  return useQuery({
    queryKey: ['intervention-questions', category],
    queryFn: () => interventionApi.getQuestions(category as string),
    enabled: Boolean(category),
    staleTime: 1000 * 60,
  })
}

export function useRiskScore() {
  return useMutation({
    mutationFn: (answers: InterventionAnswer[]) => interventionApi.getRiskScore(answers),
  })
}
