import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useWishlistContext } from '../hooks/WishlistContext'
import TemptationInfo from './TemptationInfo'

vi.mock('@/features/drawer/useDrawer', () => ({
  useDrawer: () => ({ open: vi.fn() }),
}))

vi.mock('../hooks/WishlistContext', () => ({
  useWishlistContext: vi.fn(),
}))

vi.mock('../hooks/useWishlistDetail', () => ({
  useWishlistDetail: () => ({ isUnauthorized: false, errorKind: null }),
}))

function mockContext(overrides: Partial<ReturnType<typeof useWishlistContext>>) {
  vi.mocked(useWishlistContext).mockReturnValue({
    products: [],
    isLoading: false,
    handleDelete: vi.fn(),
    isDeleting: false,
    isDeleteSuccess: false,
    isDeleteError: false,
    isDeleteUnauthorized: false,
    deleteErrorKind: null,
    resetDeleteStatus: vi.fn(),
    ...overrides,
  } as unknown as ReturnType<typeof useWishlistContext>)
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/temptation/1']}>
      <Routes>
        <Route path="/temptation/:id" element={<TemptationInfo />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('TemptationInfo', () => {
  beforeEach(() => vi.clearAllMocks())

  it('목록을 불러오는 동안에는 "상품을 찾을 수 없습니다" 대신 스켈레톤을 보여준다', () => {
    mockContext({ isLoading: true })
    renderPage()

    expect(screen.getByRole('status', { name: '상품 정보 불러오는 중' })).toBeInTheDocument()
    expect(screen.queryByText('상품을 찾을 수 없습니다.')).not.toBeInTheDocument()
  })

  it('목록을 다 불러왔는데 상품이 없으면 찾을 수 없다고 안내한다', () => {
    mockContext({ isLoading: false })
    renderPage()

    expect(screen.getByText('상품을 찾을 수 없습니다.')).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})
