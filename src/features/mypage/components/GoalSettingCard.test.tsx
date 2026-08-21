import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useConsumptionReport } from '../hooks/useConsumptionReport'
import { useMe, useSetSavingGoal } from '../hooks/useUser'
import GoalSettingCard from './GoalSettingCard'

vi.mock('../hooks/useUser', () => ({
  useMe: vi.fn(),
  useSetSavingGoal: vi.fn(),
}))

vi.mock('../hooks/useConsumptionReport', () => ({
  useConsumptionReport: vi.fn(),
}))

describe('GoalSettingCard', () => {
  const setSavingGoal = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useSetSavingGoal).mockReturnValue({
      mutate: setSavingGoal,
      isPending: false,
    } as unknown as ReturnType<typeof useSetSavingGoal>)
    vi.mocked(useMe).mockReturnValue({
      data: {
        id: '1',
        nickname: '테스터',
        profileImageUrl: null,
        savingGoalText: '여행 자금',
        interestTagsJson: null,
        phoneNumber: null,
        birthDate: null,
        gender: null,
        email: 'tester@example.com',
        loginProvider: 'LOCAL',
        hasPassword: true,
        hourlyWage: '10030',
      },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useMe>)
    vi.mocked(useConsumptionReport).mockReturnValue({
      data: {
        reportMonth: '2026-08',
        totalConsumption: { totalAmount: 0, categories: [] },
        savingStatus: {
          totalAttemptCount: 0,
          skipped: { amount: 0, count: 0 },
          consumed: { amount: 0, count: 0 },
        },
        goalAchievement: {
          status: 'NOT_SET',
          achievementRate: 0,
          targetAmount: 500000,
          savedAmount: 0,
          remainingAmount: 500000,
        },
        insights: { hasEnoughData: false, insights: [] },
        categoryDefenseSummary: [],
      },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useConsumptionReport>)
  })

  it('저장된 비활성 목표를 편집 상태에 반영한다', async () => {
    render(<GoalSettingCard />)

    expect(await screen.findByRole('button', { name: '목표 달성 표시 켜기' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '저장하기' }))

    await waitFor(() => {
      expect(setSavingGoal).toHaveBeenCalledWith(
        {
          savingGoalText: '여행 자금',
          targetSavingAmount: 500000,
          savingGoalIsActive: false,
        },
        expect.any(Object),
      )
    })
  })
})
