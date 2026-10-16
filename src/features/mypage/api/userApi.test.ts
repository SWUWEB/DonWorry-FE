import { beforeEach, describe, expect, it, vi } from 'vitest'
import client from '@/api/client'
import { userApi } from './userApi'

vi.mock('@/api/client', () => ({
  default: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))

const monthlyBudgetResult = {
  yearMonth: '2026-08',
  monthlyIncome: '1000000',
  monthlyBudget: '500000',
  spentAmount: '200000',
  remainingAmount: '800000',
  usageRate: 20,
  hourlyWage: '10000',
  categoryBudgets: [
    {
      categoryCode: 'FOOD_SNACK',
      budgetAmount: '300000',
      spentAmount: '120000',
      remainingAmount: '180000',
      usageRate: 40,
    },
  ],
}

describe('userApi budget', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('전용 목표 조회에서 비활성 여부와 금액을 복원한다', async () => {
    vi.mocked(client.get).mockResolvedValueOnce({
      data: {
        data: {
          savingGoalText: '여행',
          targetSavingAmount: '500000',
          savingGoalIsActive: false,
          savedAmount: '10000',
          achievementRate: 2,
        },
      },
    })
    await expect(userApi.getSavingGoal()).resolves.toEqual({
      savingGoalText: '여행',
      targetSavingAmount: 500000,
      savingGoalIsActive: false,
      savedAmount: 10000,
      achievementRate: 2,
    })
    expect(client.get).toHaveBeenCalledWith('/api/v1/users/me/saving-goal')
  })

  it('미설정 목표의 null 금액을 0으로 바꾸지 않는다', async () => {
    const goal = {
      savingGoalText: null,
      targetSavingAmount: null,
      savingGoalIsActive: false,
      savedAmount: null,
      achievementRate: null,
    }
    vi.mocked(client.get).mockResolvedValueOnce({ data: { data: goal } })
    await expect(userApi.getSavingGoal()).resolves.toEqual(goal)
  })

  it('목표 활성 상태만 저장할 수 있고 새 저장 응답을 변환한다', async () => {
    vi.mocked(client.put).mockResolvedValueOnce({
      data: {
        data: {
          savingGoalText: '여행',
          targetSavingAmount: '500000',
          savingGoalIsActive: true,
          savedAmount: '0',
          achievementRate: 0,
        },
      },
    })
    const result = await userApi.setSavingGoal({ savingGoalIsActive: true })
    expect(client.put).toHaveBeenCalledWith('/api/v1/users/me/saving-goal', {
      savingGoalIsActive: true,
    })
    expect(result.targetSavingAmount).toBe(500000)
    expect(result.savedAmount).toBe(0)
  })

  it('이메일 변경 인증 요청과 확인에 Swagger 필드명을 사용한다', async () => {
    const verification = {
      newEmail: 'new@example.com',
      codeTtlSeconds: 600,
      resendCooldownSeconds: 60,
    }
    vi.mocked(client.post).mockResolvedValueOnce({ data: { data: verification } })
    await expect(userApi.sendEmailChangeCode({ newEmail: 'new@example.com' })).resolves.toEqual(
      verification,
    )
    expect(client.post).toHaveBeenCalledWith('/api/v1/users/me/email-verifications', {
      newEmail: 'new@example.com',
    })
    vi.mocked(client.patch).mockResolvedValueOnce({ data: { data: { email: 'new@example.com' } } })
    await expect(
      userApi.changeEmail({ newEmail: 'new@example.com', code: '123456' }),
    ).resolves.toEqual({ email: 'new@example.com' })
    expect(client.patch).toHaveBeenCalledWith('/api/v1/users/me/email', {
      newEmail: 'new@example.com',
      code: '123456',
    })
  })

  it('목표 삭제 endpoint를 호출하고 응답을 반환한다', async () => {
    const result = { id: '1', savingGoalIsActive: false }
    vi.mocked(client.delete).mockResolvedValueOnce({ data: { data: result } })
    await expect(userApi.deleteSavingGoal()).resolves.toEqual(result)
    expect(client.delete).toHaveBeenCalledWith('/api/v1/users/me/saving-goal')
  })

  it('월별 예산 응답의 금액과 카테고리 코드를 화면 모델로 변환한다', async () => {
    vi.mocked(client.get).mockResolvedValueOnce({
      data: { success: true, message: 'OK', data: monthlyBudgetResult },
    })

    const result = await userApi.getBudget('2026-08')

    expect(client.get).toHaveBeenCalledWith('/api/v1/users/me/budget', {
      params: { yearMonth: '2026-08' },
    })
    expect(result).toEqual({
      yearMonth: '2026-08',
      monthlyIncome: 1000000,
      monthlyBudget: 500000,
      spentAmount: 200000,
      remainingAmount: 800000,
      usageRate: 20,
      hourlyWage: 10000,
      categoryBudgets: [
        {
          category: '음식',
          budgetAmount: 300000,
          spentAmount: 120000,
          remainingAmount: 180000,
          usageRate: 40,
        },
      ],
    })
  })

  it('예산이 없는 달의 null 응답을 유지한다', async () => {
    vi.mocked(client.get).mockResolvedValueOnce({
      data: { success: true, message: 'OK', data: null },
    })

    await expect(userApi.getBudget('2026-07')).resolves.toBeNull()
  })

  it('카테고리 이름을 Swagger enum으로 변환해 저장하고 응답을 화면 모델로 변환한다', async () => {
    vi.mocked(client.put).mockResolvedValueOnce({
      data: { success: true, message: 'OK', data: monthlyBudgetResult },
    })

    const result = await userApi.setBudget({
      yearMonth: '2026-08',
      monthlyIncome: 1000000,
      monthlyBudget: 300000,
      categoryBudgets: [{ category: '음식', budgetAmount: 300000 }],
    })

    expect(client.put).toHaveBeenCalledWith('/api/v1/users/me/budget', {
      yearMonth: '2026-08',
      monthlyIncome: 1000000,
      monthlyBudget: 300000,
      categoryBudgets: [{ categoryCode: 'FOOD_SNACK', budgetAmount: 300000 }],
    })
    expect(result.categoryBudgets[0].category).toBe('음식')
  })

  it('월 수입만 수정할 때 예산 필드를 임의의 0이나 빈 배열로 덮어쓰지 않는다', async () => {
    vi.mocked(client.put).mockResolvedValueOnce({
      data: { success: true, message: 'OK', data: monthlyBudgetResult },
    })

    await userApi.setBudget({ yearMonth: '2026-08', monthlyIncome: 1200000 })

    expect(client.put).toHaveBeenCalledWith('/api/v1/users/me/budget', {
      yearMonth: '2026-08',
      monthlyIncome: 1200000,
    })
  })

  it('시급을 Swagger의 hourlyWage 필드로 저장한다', async () => {
    vi.mocked(client.put).mockResolvedValueOnce({
      data: { success: true, message: 'OK', data: monthlyBudgetResult },
    })

    await userApi.setBudget({ yearMonth: '2026-08', hourlyWage: 12000 })

    expect(client.put).toHaveBeenCalledWith('/api/v1/users/me/budget', {
      yearMonth: '2026-08',
      hourlyWage: 12000,
    })
  })
})
