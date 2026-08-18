import type { CategoryBudgetEntry } from './CategoryBudgetSection'

// TEMP PREVIEW: 디자인 확인용 목업 데이터입니다. 백엔드 연동이 끝나면 이 파일째로 제거하세요.
export const MOCK_BUDGET = { monthlyIncome: '3000000', monthlyBudget: '2000000' }

export const MOCK_RATIO = {
  totalAmount: 900000,
  skippedAmount: 0,
  consumedAmount: 900000,
  skippedRatio: 0,
  consumedRatio: 0.3,
}

// 카테고리별 예산은 백엔드 API가 없어 로컬 상태로만 유지됩니다.
export const MOCK_CATEGORY_ENTRIES: CategoryBudgetEntry[] = [
  { category: '음식', budgetAmount: 400000, spentAmount: 287000 },
  { category: '패션', budgetAmount: 300000, spentAmount: 213000 },
  { category: '카페/디저트', budgetAmount: 100000, spentAmount: 95000 },
  { category: '여행', budgetAmount: 80000, spentAmount: 52000 },
  { category: '건강/운동', budgetAmount: 120000, spentAmount: 98000 },
]
