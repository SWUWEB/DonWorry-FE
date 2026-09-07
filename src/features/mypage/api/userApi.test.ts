import { beforeEach, describe, expect, it, vi } from 'vitest'
import client from '@/api/client'
import { userApi } from './userApi'

vi.mock('@/api/client', () => ({
  default: { get: vi.fn(), patch: vi.fn(), put: vi.fn(), delete: vi.fn() },
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
