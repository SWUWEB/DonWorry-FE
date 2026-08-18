import client from '@/api/client'

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface ConsumptionReportCategory {
  categoryCode: string
  categoryLabel: string
  amount: number
  ratio: number
}

export interface ConsumptionReportInsight {
  type: 'VULNERABLE_TIME' | 'INFLOW_CHANNEL'
  weekdayLabel?: string
  hour?: number | null
  amount?: number | null
  ratio?: number | null
  channel?: string | null
  count?: number | null
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
    categories: ConsumptionReportCategory[]
  }
  savingStatus: {
    totalAttemptCount: number
    skipped: { amount: number; count: number }
    consumed: { amount: number; count: number }
  }
  goalAchievement: {
    status: 'NOT_SET' | 'IN_PROGRESS' | 'ACHIEVED'
    achievementRate: number
    targetAmount: number | null
    savedAmount: number
    remainingAmount: number | null
  }
  insights: {
    hasEnoughData: boolean
    insights: ConsumptionReportInsight[]
  }
  categoryDefenseSummary: CategoryDefenseSummary[]
}

export const reportApi = {
  getConsumptionDetail: async (month?: string): Promise<ConsumptionReportDetail> => {
    const { data } = await client.get<ApiResponse<ConsumptionReportDetail>>(
      '/api/v1/reports/consumption/detail',
      { params: month ? { month } : undefined },
    )
    return data.data
  },
}
