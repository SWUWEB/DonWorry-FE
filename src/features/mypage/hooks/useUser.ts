import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { userApi } from '../api/userApi'
import type { ConsumptionReportDetail } from '../api/consumptionReportApi'
import { getCurrentYearMonth } from '@/shared/utils/date'
import type {
  ChangePasswordRequest,
  SetBudgetRequest,
  SetSavingGoalRequest,
  UpdateProfileRequest,
  UserProfile,
} from '../api/userApi'

const QUERY_KEYS = {
  me: ['user', 'me'] as const,
  budget: (yearMonth: string) => ['user', 'budget', yearMonth] as const,
}

export function useMe(enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.me,
    queryFn: userApi.getMe,
    enabled,
    staleTime: 1000 * 60 * 5,
  })
}

export function useUpdateMe() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: UpdateProfileRequest) => userApi.updateMe(body),
    // 수정 응답에는 계정 제공자 등 GET 전용 필드가 없으므로 전체 프로필을 다시 조회합니다.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.me }),
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
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.me }),
        queryClient.invalidateQueries({ queryKey: ['consumption-report'] }),
      ])
    },
  })
}

export function useDeleteSavingGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: userApi.deleteSavingGoal,
    onSuccess: async () => {
      // 진행 중인 조회가 삭제 이전의 목표를 다시 덮어쓰지 않도록 취소합니다.
      await Promise.all([
        queryClient.cancelQueries({ queryKey: QUERY_KEYS.me }),
        queryClient.cancelQueries({ queryKey: ['consumption-report'] }),
      ])
      queryClient.setQueryData<UserProfile>(QUERY_KEYS.me, (profile) =>
        profile ? { ...profile, savingGoalText: null } : profile,
      )
      queryClient.setQueryData<ConsumptionReportDetail>(
        ['consumption-report', 'detail', getCurrentYearMonth()],
        (report) =>
          report
            ? {
                ...report,
                goalAchievement: {
                  ...report.goalAchievement,
                  status: 'NOT_SET',
                  targetAmount: null,
                  remainingAmount: null,
                  achievementRate: 0,
                },
              }
            : report,
      )
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.me }),
        queryClient.invalidateQueries({ queryKey: ['consumption-report'] }),
        queryClient.invalidateQueries({ queryKey: ['home'] }),
      ])
    },
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
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.me })
    },
  })
}
