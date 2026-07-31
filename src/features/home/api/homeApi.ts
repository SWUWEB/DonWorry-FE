// import client from '@/api/client'
import type { HomeData, CategoryData } from '../types'

const BAR_COLORS = ['#286A6D', '#C7E3E3', '#E5F2F1', '#2F7F82', '#286A6D']

// ─── Mock 데이터 (API 연결 후 제거) ────────────────────────────────────────
interface SpendingRecord {
  category: string
  amount: number
  type: 'bought' | 'resisted'
}

const mockRecords: SpendingRecord[] = [
  { category: '음식', amount: 150000, type: 'bought' },
  { category: '취미/굿즈', amount: 80000, type: 'bought' },
  { category: '패션', amount: 120000, type: 'bought' },
  { category: '여행', amount: 60000, type: 'bought' },
  { category: '뷰티', amount: 30000, type: 'bought' },
  { category: '음식', amount: 30000, type: 'resisted' },
  { category: '전자기기', amount: 200000, type: 'resisted' },
  { category: '패션', amount: 120000, type: 'resisted' },
]

function buildHomeData(): HomeData {
  const bought = mockRecords.filter((r) => r.type === 'bought')
  const resisted = mockRecords.filter((r) => r.type === 'resisted')

  const categoryMap = new Map<string, number>()
  for (const r of bought) {
    categoryMap.set(r.category, (categoryMap.get(r.category) ?? 0) + r.amount)
  }

  const sorted = [...categoryMap.entries()].sort((a, b) => b[1] - a[1])
  const top4 = sorted.slice(0, 4)
  const rest = sorted.slice(4)
  const otherAmount = rest.reduce((sum, [, amount]) => sum + amount, 0)

  const categories: CategoryData[] = [
    ...top4.map(([label, amount], i) => ({
      label,
      amount,
      color: BAR_COLORS[i],
      isOther: false,
    })),
    ...(otherAmount > 0
      ? [{ label: '그 외', amount: otherAmount, color: BAR_COLORS[4], isOther: true }]
      : []),
  ]

  const monthlySpending = bought.reduce((sum, r) => sum + r.amount, 0)
  const goalCurrent = resisted.reduce((sum, r) => sum + r.amount, 0)

  return {
    monthlySpending,
    lastMonthSpending: 320000,
    budget: 500000,
    goalAmount: 500000,
    goalCurrent,
    categories,
    hasRecords: bought.length > 0,
  }
}
// ──────────────────────────────────────────────────────────────────────────

export const homeApi = {
  getHomeData: async (): Promise<HomeData> => {
    // TODO: API 연결 시 아래 두 줄로 교체하고 mock 제거
    // const { data } = await client.get<HomeData>('/home')
    // return data
    return buildHomeData()
  },
}
