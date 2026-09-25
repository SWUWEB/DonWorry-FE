import type { PropsWithChildren } from 'react'
import { act, renderHook } from '@testing-library/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createQueryClient } from '@/api/queryClient'
import { getCurrentYearMonth } from '@/shared/utils/date'
import { userApi } from '../api/userApi'
import { useDeleteSavingGoal } from './useUser'

vi.mock('../api/userApi', () => ({ userApi: { deleteSavingGoal: vi.fn() } }))

describe('목표 삭제 캐시 동기화', () => {
  beforeEach(() => vi.clearAllMocks())

  function setup() {
    const queryClient = createQueryClient()
    const reportKey = ['consumption-report', 'detail', getCurrentYearMonth()]
    const profile = { id: '1', nickname: '테스터', savingGoalText: '여행 자금' }
    const report = {
      goalAchievement: {
        status: 'IN_PROGRESS',
        targetAmount: 500000,
        savedAmount: 10000,
        remainingAmount: 490000,
        achievementRate: 2,
      },
      savingStatus: { skipped: { amount: 10000, count: 1 } },
    }
    queryClient.setQueryData(['user', 'me'], profile)
    queryClient.setQueryData(reportKey, report)
    queryClient.setQueryData(['home'], { achievementRate: 2 })
    const { result } = renderHook(() => useDeleteSavingGoal(), {
      wrapper: ({ children }: PropsWithChildren) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    })
    return { queryClient, reportKey, profile, report, result }
  }

  it('성공하면 현재 목표만 비우고 사용자·리포트·홈 데이터를 무효화한다', async () => {
    vi.mocked(userApi.deleteSavingGoal).mockResolvedValue({ id: '1', savingGoalIsActive: false })
    const { queryClient, reportKey, profile, report, result } = setup()
    await act(async () => {
      await result.current.mutateAsync()
    })
    expect(queryClient.getQueryData(['user', 'me'])).toEqual({ ...profile, savingGoalText: null })
    expect(queryClient.getQueryData(reportKey)).toEqual({
      ...report,
      goalAchievement: {
        status: 'NOT_SET',
        targetAmount: null,
        savedAmount: 10000,
        remainingAmount: null,
        achievementRate: 0,
      },
    })
    for (const key of [['user', 'me'], reportKey, ['home']]) {
      expect(queryClient.getQueryState(key)?.isInvalidated).toBe(true)
    }
    queryClient.clear()
  })

  it('실패하면 기존 목표와 캐시를 유지한다', async () => {
    vi.mocked(userApi.deleteSavingGoal).mockRejectedValue(new Error('network'))
    const { queryClient, reportKey, profile, report, result } = setup()
    await act(async () => {
      await expect(result.current.mutateAsync()).rejects.toThrow('network')
    })
    expect(queryClient.getQueryData(['user', 'me'])).toEqual(profile)
    expect(queryClient.getQueryData(reportKey)).toEqual(report)
    expect(queryClient.getQueryState(['home'])?.isInvalidated).toBe(false)
    queryClient.clear()
  })
})
