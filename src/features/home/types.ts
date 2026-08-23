export type GoalAchievementStatus = 'NOT_SET' | 'IN_PROGRESS' | 'ACHIEVED'
export type RemainingBudgetStatus = 'NOT_SET' | 'WITHIN' | 'EXCEEDED'

export interface CategoryData {
  categoryCode: string
  label: string
  amount: number
  ratio: number
  color: string
  isOther: boolean
}

export interface HomeData {
  goalStatus: GoalAchievementStatus
  achievementRate: number
  achievementRemainingAmount: number | null
  monthlySpending: number
  comparisonRate: number | null
  comparisonMessage: string | null
  budgetStatus: RemainingBudgetStatus
  remainingBudget: number | null
  budgetMessage: string
  categories: CategoryData[]
  categorySummaryText: string
  hasRecords: boolean
}
