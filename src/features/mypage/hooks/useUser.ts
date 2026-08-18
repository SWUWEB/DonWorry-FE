import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { userApi } from '../api/userApi'
import type {
  ChangePasswordRequest,
  SetBudgetRequest,
  SetSavingGoalRequest,
  UpdateProfileRequest,
} from '../api/userApi'

const QUERY_KEYS = {
  me: ['user', 'me'] as const,
  budget: (yearMonth: string) => ['user', 'budget', yearMonth] as const,
}

export function useMe() {
  return useQuery({
    queryKey: QUERY_KEYS.me,
    queryFn: userApi.getMe,
    staleTime: 1000 * 60 * 5,
  })
}

export function useUpdateMe() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: UpdateProfileRequest) => userApi.updateMe(body),
    onSuccess: (profile) => {
      queryClient.setQueryData(QUERY_KEYS.me, profile)
    },
  })
}

export function useDeleteMe() {
  return useMutation({
    mutationFn: userApi.deleteMe,
  })
}

export function useSetSavingGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: SetSavingGoalRequest) => userApi.setSavingGoal(body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.me }),
  })
}

export function useDeleteSavingGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: userApi.deleteSavingGoal,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.me }),
  })
}

export function useBudget(yearMonth: string) {
  return useQuery({
    queryKey: QUERY_KEYS.budget(yearMonth),
    queryFn: () => userApi.getBudget(yearMonth),
    staleTime: 1000 * 60 * 5,
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (body: ChangePasswordRequest) => userApi.changePassword(body),
  })
}

export function useSetBudget() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: SetBudgetRequest) => userApi.setBudget(body),
    onSuccess: (budget) => {
      queryClient.setQueryData(QUERY_KEYS.budget(budget.yearMonth), budget)
    },
  })
}
