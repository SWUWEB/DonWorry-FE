import client from '@/api/client'
import type { CategoryData, GoalAchievementStatus, HomeData, RemainingBudgetStatus } from '../types'

const BAR_COLORS = ['#286A6D', '#C7E3E3', '#E5F2F1', '#2F7F82', '#286A6D']

interface HomeSummaryData {
  goalAchievement: {
    status: GoalAchievementStatus
    rate: number
    remainingAmount: number | null
    message: string
  }
  consumptionChart: {
    hasData: boolean
    categories: {
      categoryCode: string
      categoryLabel: string
      amount: number
      ratio: number
    }[]
    others: { amount: number; ratio: number } | null
    summaryText: string
  }
  thisMonthSpending: {
    amount: number
    comparisonRate: number | null
    comparisonMessage: string | null
  }
  remainingBudget: {
    status: RemainingBudgetStatus
    amount: number | null
    message: string
  }
}

function mapHomeSummary(data: HomeSummaryData): HomeData {
  const categories: CategoryData[] = [
    ...data.consumptionChart.categories.map((c, i) => ({
      categoryCode: c.categoryCode,
      label: c.categoryLabel,
      amount: c.amount,
      ratio: c.ratio,
      color: BAR_COLORS[i] ?? BAR_COLORS[BAR_COLORS.length - 1],
      isOther: false,
    })),
    ...(data.consumptionChart.others
      ? [
          {
            categoryCode: 'ETC',
            label: '그 외',
            amount: data.consumptionChart.others.amount,
            ratio: data.consumptionChart.others.ratio,
            color: BAR_COLORS[BAR_COLORS.length - 1],
            isOther: true,
          },
        ]
      : []),
  ]

  return {
    goalStatus: data.goalAchievement.status,
    achievementRate: data.goalAchievement.rate,
    achievementRemainingAmount: data.goalAchievement.remainingAmount,
    monthlySpending: data.thisMonthSpending.amount,
    comparisonRate: data.thisMonthSpending.comparisonRate,
    comparisonMessage: data.thisMonthSpending.comparisonMessage,
    budgetStatus: data.remainingBudget.status,
    remainingBudget: data.remainingBudget.amount,
    budgetMessage: data.remainingBudget.message,
    categories,
    categorySummaryText: data.consumptionChart.summaryText,
    hasRecords: data.consumptionChart.hasData,
  }
}

export const homeApi = {
  getHomeData: async (): Promise<HomeData> => {
    const { data } = await client.get<{ data: HomeSummaryData }>('/api/v1/home/summary')
    return mapHomeSummary(data.data)
  },
}
