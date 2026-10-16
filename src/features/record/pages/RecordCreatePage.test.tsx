import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { consumptionRecordApi } from '@/features/record/api/consumptionRecordApi'
import RecordCreatePage from './RecordCreatePage'

vi.mock('@/features/drawer/useDrawer', () => ({
  useDrawer: () => ({ open: vi.fn() }),
}))

vi.mock('@/features/record/api/consumptionRecordApi', () => ({
  consumptionRecordApi: {
    getDetail: vi.fn(),
    update: vi.fn(),
  },
}))

const record = {
  id: '1',
  title: '커피',
  category: '식비',
  amount: 4500,
  type: 'consume' as const,
  date: '2026.09.30',
  occurredAt: '2026-09-30T00:00:00',
  reason: '',
  recentCategoryConsumptionCount: 0,
  recentCategoryConsumptions: [],
}

function renderEditFlow() {
  const router = createMemoryRouter(
    [
      { path: '/record', element: <p>소비 기록 목록</p> },
      { path: '/record/:id', element: <p>소비 상세</p> },
      { path: '/record/:id/edit', element: <RecordCreatePage /> },
    ],
    { initialEntries: ['/record', '/record/1', '/record/1/edit'], initialIndex: 2 },
  )
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })

  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )

  return router
}

describe('RecordCreatePage 수정 모드', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(consumptionRecordApi.getDetail).mockResolvedValue(record)
    vi.mocked(consumptionRecordApi.update).mockResolvedValue({} as never)
  })

  it('수정 완료 후 상세 화면에서 뒤로가기를 누르면 목록으로 이동한다', async () => {
    const router = renderEditFlow()

    await userEvent.click(await screen.findByRole('button', { name: '수정하기' }))

    expect(await screen.findByText('소비 상세')).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/record/1')

    await router.navigate(-1)

    expect(await screen.findByText('소비 기록 목록')).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/record')
  })
})
