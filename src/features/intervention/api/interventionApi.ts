import client from '@/api/client'
import { CATEGORY_LABEL_TO_CODE } from '@/constants/product'
import { formatDateKorean } from '@/shared/utils/date'

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

interface QuestionOptionResult {
  answerValue: boolean
  label: string
}

interface QuestionResult {
  questionId: string
  questionText: string
  description: string
  sortOrder: number
  options: QuestionOptionResult[]
}

interface RecentCategoryConsumptionRecord {
  consumptionRecordId: string
  productName: string
  price: number
  occurredAt: string
}

interface InterventionQuestionsResult {
  questions: QuestionResult[]
  recentCategoryConsumption: {
    categoryCode: string
    totalCount: number
    records: RecentCategoryConsumptionRecord[]
  }
}

type ApiRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH'

interface RiskAnalysisResult {
  riskScore: number
  riskLevel: ApiRiskLevel
  riskMessage: string
}

export interface InterventionOption {
  answerValue: boolean
  label: string
}

export interface InterventionQuestion {
  questionId: string
  heading: string
  description: string
  options: InterventionOption[]
}

export interface RecentSpendingRecord {
  id: string
  title: string
  date: string
  amount: number
}

export interface InterventionQuestionsData {
  questions: InterventionQuestion[]
  recentCategoryConsumptionCount: number
  recentCategoryConsumptions: RecentSpendingRecord[]
}

export interface InterventionAnswer {
  questionId: string
  answerValue: boolean
}

export type RiskLevel = 'low' | 'medium' | 'high'

export interface RiskAnalysis {
  riskScore: number
  riskLevel: RiskLevel
  riskMessage: string
}

const RISK_LEVEL_TO_FRONT: Record<ApiRiskLevel, RiskLevel> = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
}

export const interventionApi = {
  getQuestions: async (category: string): Promise<InterventionQuestionsData> => {
    const { data } = await client.get<ApiResponse<InterventionQuestionsResult>>(
      '/api/v1/intervention-questions',
      { params: { category_code: CATEGORY_LABEL_TO_CODE[category] } },
    )

    const questions = [...data.data.questions]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((question) => ({
        questionId: question.questionId,
        heading: question.questionText,
        description: question.description,
        options: question.options,
      }))

    const { totalCount, records } = data.data.recentCategoryConsumption

    return {
      questions,
      recentCategoryConsumptionCount: totalCount,
      recentCategoryConsumptions: records.map((record) => ({
        id: record.consumptionRecordId,
        title: record.productName,
        date: formatDateKorean(record.occurredAt),
        amount: record.price,
      })),
    }
  },

  getRiskScore: async (answers: InterventionAnswer[]): Promise<RiskAnalysis> => {
    const { data } = await client.post<ApiResponse<RiskAnalysisResult>>(
      '/api/v1/interventions/risk-score',
      { interventionAnswers: answers },
    )

    return {
      riskScore: data.data.riskScore,
      riskLevel: RISK_LEVEL_TO_FRONT[data.data.riskLevel],
      riskMessage: data.data.riskMessage,
    }
  },
}
