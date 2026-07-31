export interface CategoryData {
  label: string
  amount: number
  color: string
  isOther: boolean
}

export interface HomeData {
  monthlySpending: number
  lastMonthSpending: number | null
  budget: number | null
  goalAmount: number | null
  goalCurrent: number
  categories: CategoryData[]
  hasRecords: boolean
}
