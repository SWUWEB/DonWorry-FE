import type { PropsWithChildren } from 'react'
import { act, renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { consumptionRecordApi } from '../api/consumptionRecordApi'
import {
  useCreateConsumptionRecord,
  useDeleteConsumptionRecord,
  useUpdateConsumptionRecord,
} from './useConsumptionRecords'

vi.mock('../api/consumptionRecordApi', () => ({
  consumptionRecordApi: {
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}))

const input = {
  type: 'consume' as const,
  productName: '커피',
  price: 4500,
}

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: PropsWithChildren) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('소비 기록 mutation 캐시 동기화', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(consumptionRecordApi.create).mockResolvedValue({} as never)
    vi.mocked(consumptionRecordApi.update).mockResolvedValue({} as never)
    vi.mocked(consumptionRecordApi.remove).mockResolvedValue()
  })

  it.each([
    {
      name: '생성',
      useMutationHook: useCreateConsumptionRecord,
      mutate: (run: (value: typeof input) => Promise<unknown>) => run(input),
    },
    {
      name: '수정',
      useMutationHook: useUpdateConsumptionRecord,
      mutate: (run: (value: { id: string; input: typeof input }) => Promise<unknown>) =>
        run({ id: '1', input }),
    },
    {
      name: '삭제',
      useMutationHook: useDeleteConsumptionRecord,
      mutate: (run: (value: string) => Promise<unknown>) => run('1'),
    },
  ])('$name 성공 후 기록·예산·리포트를 함께 갱신한다', async ({ useMutationHook, mutate }) => {
    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
    })
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(() => useMutationHook(), {
      wrapper: createWrapper(queryClient),
    })

    await act(async () => {
      await mutate(result.current.mutateAsync as never)
    })

    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['consumption-records'] })
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['user', 'budget'] })
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['consumption-report'] })
  })
})
