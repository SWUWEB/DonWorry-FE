import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getCurrentYearMonth } from '@/shared/utils/date'
import { useBudget, useSetBudget } from '../hooks/useUser'
import BudgetSettingCard from './BudgetSettingCard'

vi.mock('../hooks/useUser', () => ({
  useBudget: vi.fn(),
  useSetBudget: vi.fn(),
}))

describe('BudgetSettingCard', () => {
  const setBudget = vi.fn()
  const currentYearMonth = getCurrentYearMonth()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useSetBudget).mockReturnValue({
      mutate: setBudget,
      isPending: false,
    } as unknown as ReturnType<typeof useSetBudget>)
    vi.mocked(useBudget).mockReturnValue({
      data: {
        yearMonth: currentYearMonth,
        monthlyIncome: 1000000,
        monthlyBudget: 300000,
        spentAmount: 200000,
        remainingAmount: 800000,
        usageRate: 20,
        categoryBudgets: [
          {
            category: '음식',
            budgetAmount: 300000,
            spentAmount: 120000,
            remainingAmount: 180000,
            usageRate: 40,
          },
        ],
      },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useBudget>)
  })

  it('월별 응답의 카테고리 예산을 복원하고 저장 요청에 포함한다', async () => {
    render(<BudgetSettingCard />)

    await screen.findAllByText('300,000원')
    fireEvent.click(screen.getByRole('button', { name: '저장하기' }))

    await waitFor(() => {
      expect(setBudget).toHaveBeenCalledWith(
        {
          yearMonth: currentYearMonth,
          monthlyIncome: 1000000,
          monthlyBudget: 300000,
          categoryBudgets: [{ category: '음식', budgetAmount: 300000 }],
        },
        expect.any(Object),
      )
    })
  })

  it('현재 월 요약에 최근 28일 값이 아닌 월별 예산 응답을 표시한다', async () => {
    render(<BudgetSettingCard />)

    expect(await screen.findByText('20만원')).toBeInTheDocument()
    expect(screen.getByText('80만원')).toBeInTheDocument()
    expect(screen.getByText('20%')).toBeInTheDocument()
  })

  it('카테고리 예산이 없는 달에도 월 수입만 저장할 수 있다', async () => {
    vi.mocked(useBudget).mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useBudget>)
    render(<BudgetSettingCard />)

    fireEvent.click(screen.getByRole('button', { name: /이번 달 수입/ }))
    fireEvent.change(screen.getByLabelText('이번 달 수입'), {
      target: { value: '1200000' },
    })
    fireEvent.click(screen.getByRole('button', { name: '저장하기' }))

    await waitFor(() => {
      expect(setBudget).toHaveBeenCalledWith(
        { yearMonth: currentYearMonth, monthlyIncome: 1200000 },
        expect.any(Object),
      )
    })
  })

  it('기존 월 수입을 비우면 0을 보내 초기화한다', async () => {
    render(<BudgetSettingCard />)

    fireEvent.click(screen.getByRole('button', { name: /이번 달 수입/ }))
    fireEvent.change(screen.getByLabelText('이번 달 수입'), { target: { value: '' } })
    fireEvent.click(screen.getByRole('button', { name: '저장하기' }))

    await waitFor(() => {
      expect(setBudget).toHaveBeenCalledWith(
        {
          yearMonth: currentYearMonth,
          monthlyIncome: 0,
          monthlyBudget: 300000,
          categoryBudgets: [{ category: '음식', budgetAmount: 300000 }],
        },
        expect.any(Object),
      )
    })
  })

  it('저장 응답으로 예산 캐시가 갱신되어도 성공 메시지를 유지한다', async () => {
    setBudget.mockImplementationOnce((_body: unknown, options: { onSuccess: () => void }) =>
      options.onSuccess(),
    )
    const { rerender } = render(<BudgetSettingCard />)

    fireEvent.click(screen.getByRole('button', { name: '저장하기' }))
    expect(await screen.findByText('저장되었습니다.')).toBeInTheDocument()

    const currentBudget = vi.mocked(useBudget).mock.results.at(-1)?.value.data
    vi.mocked(useBudget).mockReturnValue({
      ...vi.mocked(useBudget).mock.results.at(-1)?.value,
      data: currentBudget ? { ...currentBudget } : currentBudget,
    } as ReturnType<typeof useBudget>)
    rerender(<BudgetSettingCard />)

    await waitFor(() => expect(screen.getByText('저장되었습니다.')).toBeInTheDocument())
  })
})
