import type { PropsWithChildren } from 'react'
import { act, renderHook } from '@testing-library/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createQueryClient } from '@/api/queryClient'
import { getCurrentYearMonth } from '@/shared/utils/date'
import { userApi } from '../api/userApi'
import { useChangeEmail, useDeleteSavingGoal, useSetSavingGoal } from './useUser'

vi.mock('../api/userApi', () => ({
  userApi: {
    deleteSavingGoal: vi.fn(),
    setSavingGoal: vi.fn(),
    changeEmail: vi.fn(),
  },
}))

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
    queryClient.setQueryData(['user', 'saving-goal'], {
      savingGoalText: '여행 자금',
      targetSavingAmount: 500000,
    })
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
    expect(queryClient.getQueryData(['user', 'saving-goal'])).toEqual({
      savingGoalText: null,
      targetSavingAmount: null,
      savingGoalIsActive: false,
      savedAmount: null,
      achievementRate: null,
    })
    for (const key of [['user', 'me'], ['user', 'saving-goal'], reportKey, ['home']]) {
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

describe('저장 후 화면 갱신', () => {
  beforeEach(() => vi.clearAllMocks())

  function setup() {
    const queryClient = createQueryClient()
    const wrapper = ({ children }: PropsWithChildren) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
    return { queryClient, wrapper }
  }

  it('목표 저장 응답을 즉시 반영하고 리포트를 갱신한다', async () => {
    const { queryClient, wrapper } = setup()
    const goal = {
      savingGoalText: '여행',
      targetSavingAmount: 100000,
      savingGoalIsActive: true,
      savedAmount: 10000,
      achievementRate: 10,
    }
    queryClient.setQueryData(['consumption-report', 'detail'], {})
    queryClient.setQueryData(['home'], { achievementRate: 0 })
    vi.mocked(userApi.setSavingGoal).mockResolvedValue(goal)
    const { result } = renderHook(() => useSetSavingGoal(), { wrapper })
    await act(async () => {
      await result.current.mutateAsync({ savingGoalText: '여행', targetSavingAmount: 100000 })
    })
    expect(queryClient.getQueryData(['user', 'saving-goal'])).toEqual(goal)
    expect(queryClient.getQueryState(['consumption-report', 'detail'])?.isInvalidated).toBe(true)
    expect(queryClient.getQueryState(['home'])?.isInvalidated).toBe(true)
    queryClient.clear()
  })

  it('이메일 변경 후 프로필의 다른 필드를 유지한다', async () => {
    const { queryClient, wrapper } = setup()
    queryClient.setQueryData(['user', 'me'], { email: 'old@example.com', nickname: '테스터' })
    vi.mocked(userApi.changeEmail).mockResolvedValue({ email: 'new@example.com' })
    const { result } = renderHook(() => useChangeEmail(), { wrapper })
    await act(async () => {
      await result.current.mutateAsync({ newEmail: 'new@example.com', code: '123456' })
    })
    expect(queryClient.getQueryData(['user', 'me'])).toEqual({
      email: 'new@example.com',
      nickname: '테스터',
    })
    expect(queryClient.getQueryState(['user', 'me'])?.isInvalidated).toBe(true)
    queryClient.clear()
  })
})
