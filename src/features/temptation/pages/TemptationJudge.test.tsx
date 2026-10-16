import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useWishlistContext } from '../hooks/WishlistContext'
import type { Product } from '../types'
import TemptationJudge from './TemptationJudge'

vi.mock('@/features/drawer/useDrawer', () => ({
  useDrawer: () => ({ open: vi.fn() }),
}))

vi.mock('../hooks/WishlistContext', () => ({
  useWishlistContext: vi.fn(),
}))

const expiredProduct: Product = {
  id: '1',
  name: '무선 이어폰',
  price: 0,
  time: new Date(Date.now() - 60 * 60 * 1000),
  timeOption: '1일',
  category: '기타',
  link: null,
  reason: null,
  createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000),
}

function mockContext(overrides: Partial<ReturnType<typeof useWishlistContext>> = {}) {
  vi.mocked(useWishlistContext).mockReturnValue({
    products: [expiredProduct],
    isLoading: false,
    isFetching: false,
    isUnauthorized: false,
    handleExtend: vi.fn(),
    isExtending: false,
    isExtendSuccess: false,
    isExtendError: false,
    isExtendUnauthorized: false,
    resetExtendStatus: vi.fn(),
    handleJudgeDecision: vi.fn(),
    isDeciding: false,
    isDecideSuccess: false,
    isDecideError: false,
    isDecideUnauthorized: false,
    decideErrorKind: null,
    resetDecideStatus: vi.fn(),
    ...overrides,
  } as unknown as ReturnType<typeof useWishlistContext>)
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/temptation/1/judge']}>
      <Routes>
        <Route path="/temptation/:id/judge" element={<TemptationJudge />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('TemptationJudge', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('가격이 없어 결정이 거부되면 가격 안내만 보여주고 일반 실패 안내는 함께 열지 않는다', async () => {
    const resetDecideStatus = vi.fn()
    mockContext({ isDecideError: true, decideErrorKind: 'PRICE_REQUIRED', resetDecideStatus })
    renderPage()

    expect(screen.getAllByRole('dialog')).toHaveLength(1)
    expect(screen.getByText('가격 정보가 필요합니다.')).toBeInTheDocument()
    expect(screen.queryByText('결정을 저장하지 못했습니다.')).not.toBeInTheDocument()

    await userEvent.setup().click(screen.getByRole('button', { name: '확인' }))
    expect(resetDecideStatus).toHaveBeenCalled()
  })

  it('분류되지 않은 결정 실패는 일반 실패 안내를 보여준다', () => {
    mockContext({ isDecideError: true, decideErrorKind: null })
    renderPage()

    expect(screen.getByText('결정을 저장하지 못했습니다.')).toBeInTheDocument()
    expect(screen.queryByText('가격 정보가 필요합니다.')).not.toBeInTheDocument()
  })
})
