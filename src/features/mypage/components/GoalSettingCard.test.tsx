import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useDeleteSavingGoal, useSavingGoal, useSetSavingGoal } from '../hooks/useUser'
import GoalSettingCard from './GoalSettingCard'

vi.mock('../hooks/useUser', () => ({
  useSavingGoal: vi.fn(),
  useSetSavingGoal: vi.fn(),
  useDeleteSavingGoal: vi.fn(),
}))

describe('GoalSettingCard', () => {
  const setSavingGoal = vi.fn()
  const deleteSavingGoal = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useDeleteSavingGoal).mockReturnValue({
      mutate: deleteSavingGoal,
      isPending: false,
    } as unknown as ReturnType<typeof useDeleteSavingGoal>)
    vi.mocked(useSetSavingGoal).mockReturnValue({
      mutate: setSavingGoal,
      isPending: false,
    } as unknown as ReturnType<typeof useSetSavingGoal>)
    vi.mocked(useSavingGoal).mockReturnValue({
      data: {
        savingGoalText: '여행 자금',
        targetSavingAmount: 500000,
        savingGoalIsActive: false,
        savedAmount: 0,
        achievementRate: 0,
      },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useSavingGoal>)
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

  it('삭제 확인을 취소하거나 Escape를 누르면 요청 없이 편집 값을 유지한다', () => {
    render(<GoalSettingCard />)
    fireEvent.click(screen.getByRole('button', { name: '목표 삭제' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '취소' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '목표 삭제' }))
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(deleteSavingGoal).not.toHaveBeenCalled()
    expect(screen.getByLabelText('목표 이름')).toHaveValue('여행 자금')
  })

  it('삭제 성공 시 확인창을 닫고 새 목표를 입력할 수 있다', () => {
    render(<GoalSettingCard />)
    fireEvent.click(screen.getByRole('button', { name: '목표 삭제' }))
    fireEvent.click(screen.getByRole('button', { name: '삭제하기' }))
    expect(deleteSavingGoal).toHaveBeenCalledWith(undefined, expect.any(Object))
    act(() => deleteSavingGoal.mock.calls[0][1].onSuccess())
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('목표가 삭제되었습니다.')
    expect(screen.getByLabelText('목표 이름')).toHaveValue('')
    expect(screen.getByLabelText('목표 금액')).toHaveValue('')
    fireEvent.change(screen.getByLabelText('목표 이름'), { target: { value: '새 목표' } })
    fireEvent.change(screen.getByLabelText('목표 금액'), { target: { value: '100000' } })
    fireEvent.click(screen.getByRole('button', { name: '저장하기' }))
    expect(setSavingGoal).toHaveBeenCalledWith(
      { savingGoalText: '새 목표', targetSavingAmount: 100000, savingGoalIsActive: true },
      expect.any(Object),
    )
  })

  it('삭제 실패 시 입력을 유지하고 확인창에서 재시도할 수 있다', () => {
    render(<GoalSettingCard />)
    fireEvent.click(screen.getByRole('button', { name: '목표 삭제' }))
    fireEvent.click(screen.getByRole('button', { name: '삭제하기' }))
    act(() => deleteSavingGoal.mock.calls[0][1].onError(new Error('network')))
    expect(within(screen.getByRole('dialog')).getByRole('alert')).toHaveTextContent(
      '삭제하지 못했습니다',
    )
    expect(screen.getByLabelText('목표 이름')).toHaveValue('여행 자금')
    fireEvent.click(screen.getByRole('button', { name: '삭제하기' }))
    expect(deleteSavingGoal).toHaveBeenCalledTimes(2)
  })

  it('삭제 후 재조회 실패에도 완료 안내와 빈 목표를 유지한다', () => {
    const { rerender } = render(<GoalSettingCard />)
    fireEvent.click(screen.getByRole('button', { name: '목표 삭제' }))
    fireEvent.click(screen.getByRole('button', { name: '삭제하기' }))

    // 삭제 훅이 캐시를 비운 뒤 후속 GET만 실패한 상태입니다.
    const goalQuery = vi.mocked(useSavingGoal).getMockImplementation()!()
    const clearedGoal = {
      savingGoalText: null,
      targetSavingAmount: null,
      savingGoalIsActive: false,
      savedAmount: null,
      achievementRate: null,
    }
    vi.mocked(useSavingGoal).mockReturnValue({
      ...goalQuery,
      data: clearedGoal,
      isError: true,
    } as ReturnType<typeof useSavingGoal>)
    act(() => deleteSavingGoal.mock.calls[0][1].onSuccess())
    rerender(<GoalSettingCard />)

    expect(screen.getByRole('status')).toHaveTextContent('목표가 삭제되었습니다.')
    expect(screen.getByRole('alert')).toHaveTextContent('최신 목표 정보를 불러오지 못했습니다.')
    expect(screen.getByLabelText('목표 이름')).toHaveValue('')
    expect(screen.getByLabelText('목표 금액')).toHaveValue('')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '목표 삭제' })).not.toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('목표 이름'), { target: { value: '새 목표' } })
    fireEvent.click(screen.getByRole('button', { name: '다시 시도' }))
    expect(goalQuery.refetch).toHaveBeenCalledOnce()
    expect(deleteSavingGoal).toHaveBeenCalledOnce()

    vi.mocked(useSavingGoal).mockReturnValue({
      ...goalQuery,
      data: clearedGoal,
      isError: false,
    } as ReturnType<typeof useSavingGoal>)
    rerender(<GoalSettingCard />)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByLabelText('목표 이름')).toHaveValue('새 목표')
  })

  it('캐시 없이 첫 조회가 실패하면 기존 오류 화면과 재시도를 표시한다', () => {
    const goalQuery = vi.mocked(useSavingGoal).getMockImplementation()!()
    vi.mocked(useSavingGoal).mockReturnValue({
      ...goalQuery,
      data: undefined,
      isError: true,
    } as ReturnType<typeof useSavingGoal>)
    render(<GoalSettingCard />)
    expect(screen.getByRole('alert')).toHaveTextContent('목표 정보를 불러오지 못했습니다.')
    expect(screen.queryByLabelText('목표 이름')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '다시 시도' }))
    expect(goalQuery.refetch).toHaveBeenCalledOnce()
  })

  it('삭제 중에는 저장, 편집, 재삭제와 확인창 닫기를 막는다', () => {
    const { rerender } = render(<GoalSettingCard />)
    fireEvent.click(screen.getByRole('button', { name: '목표 삭제' }))
    vi.mocked(useDeleteSavingGoal).mockReturnValue({
      mutate: deleteSavingGoal,
      isPending: true,
    } as unknown as ReturnType<typeof useDeleteSavingGoal>)
    rerender(<GoalSettingCard />)
    for (const name of ['저장하기', '목표 삭제', '삭제 중...', '취소', '목표 달성 표시 켜기']) {
      expect(screen.getByRole('button', { name })).toBeDisabled()
    }
    expect(screen.getByLabelText('목표 이름')).toHaveAttribute('readonly')
    expect(screen.getByLabelText('목표 금액')).toHaveAttribute('readonly')
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('저장 중에는 삭제를 시작할 수 없다', () => {
    vi.mocked(useSetSavingGoal).mockReturnValue({
      mutate: setSavingGoal,
      isPending: true,
    } as unknown as ReturnType<typeof useSetSavingGoal>)
    render(<GoalSettingCard />)
    expect(screen.getByRole('button', { name: '목표 삭제' })).toBeDisabled()
  })

  it('삭제가 401로 실패하면 로그인 이동을 안내한다', () => {
    const onUnauthorized = vi.fn()
    render(<GoalSettingCard onUnauthorized={onUnauthorized} />)
    fireEvent.click(screen.getByRole('button', { name: '목표 삭제' }))
    fireEvent.click(screen.getByRole('button', { name: '삭제하기' }))
    act(() =>
      deleteSavingGoal.mock.calls[0][1].onError({ isAxiosError: true, response: { status: 401 } }),
    )
    expect(screen.getAllByRole('dialog')).toHaveLength(1)
    fireEvent.click(screen.getByRole('button', { name: '로그인하기' }))
    expect(onUnauthorized).toHaveBeenCalledOnce()
  })

  it('저장된 목표가 없으면 삭제 버튼을 표시하지 않는다', () => {
    const current = vi.mocked(useSavingGoal).getMockImplementation()!()
    vi.mocked(useSavingGoal).mockReturnValue({
      ...current,
      data: { ...current.data!, savingGoalText: null },
    } as ReturnType<typeof useSavingGoal>)
    render(<GoalSettingCard />)
    expect(screen.queryByRole('button', { name: '목표 삭제' })).not.toBeInTheDocument()
  })
})
