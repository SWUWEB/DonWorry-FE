import client from '@/api/client'

export interface ConsumptionCategory {
  categoryCode: string
  categoryLabel: string
  amount: number
  ratio: number
}

export interface SavingStatus {
  totalAttemptCount: number
  skipped: { amount: number; count: number }
  consumed: { amount: number; count: number }
}

export interface GoalAchievement {
  status: 'NOT_SET' | 'IN_PROGRESS' | 'ACHIEVED'
  achievementRate: number
  targetAmount: number | null
  savedAmount: number
  remainingAmount: number | null
}

export interface ConsumptionInsight {
  type: 'VULNERABLE_TIME' | 'INFLOW_CHANNEL'
  weekdayLabel: string
  hour: number | null
  amount: number | null
  ratio: number | null
  channel: string | null
  count: number | null
}

export interface CategoryDefenseSummary {
  categoryCode: string
  categoryLabel: string
  skippedAmount: number
  consumedAmount: number
  defenseRate: number
}

export interface ConsumptionReportDetail {
  reportMonth: string
  totalConsumption: {
    totalAmount: number
    categories: ConsumptionCategory[]
  }
  savingStatus: SavingStatus
  goalAchievement: GoalAchievement
  insights: {
    hasEnoughData: boolean
    insights: ConsumptionInsight[]
  }
  categoryDefenseSummary: CategoryDefenseSummary[]
}

export const consumptionReportApi = {
  getDetail: async (month?: string): Promise<ConsumptionReportDetail> => {
    const params = month ? { month } : {}
    const { data } = await client.get<{ data: ConsumptionReportDetail }>(
      '/api/v1/reports/consumption/detail',
      { params },
    )
    return data.data
  },
}
