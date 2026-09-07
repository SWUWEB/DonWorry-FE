import client from '@/api/client'
import type { PostApiV1ConsumptionRecordsData } from '@/api/generated'
import { formatDateKorean } from '@/shared/utils/date'
import { CATEGORY_LABEL_TO_CODE } from '@/constants/product'
import type { RecordItem, RecordType } from '@/features/record/mockRecords'
import type { InterventionAnswer } from '@/features/intervention/api/interventionApi'

type ApiRecordType = 'CONSUMED' | 'SKIPPED'

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

interface ConsumptionRecordResult {
  id: string
  type: ApiRecordType
  productName: string
  price: number | null
  categoryCode: string
  categoryLabel: string
  reason: string | null
  occurredAt: string
}

interface ConsumptionRecordDetailResult extends ConsumptionRecordResult {
  recentCategoryConsumptionCount: number
  recentCategoryConsumptions: ConsumptionRecordResult[]
}

export interface RecordDetail extends RecordItem {
  recentCategoryConsumptionCount: number
  recentCategoryConsumptions: RecordItem[]
}

interface ConsumptionRatioResult {
  period: { startDate: string; endDate: string; days: number }
  totalAmount: number
  skippedAmount: number
  consumedAmount: number
  skippedRatio: number
  consumedRatio: number
}

export interface ConsumptionRatio {
  totalAmount: number
  skippedAmount: number
  consumedAmount: number
  skippedRatio: number
  consumedRatio: number
}

export type RecordListFilter = 'all' | RecordType

const TYPE_TO_FRONT: Record<ApiRecordType, RecordType> = {
  SKIPPED: 'saved',
  CONSUMED: 'consume',
}

const TYPE_TO_API: Record<RecordType, ApiRecordType> = {
  saved: 'SKIPPED',
  consume: 'CONSUMED',
}

const FILTER_TO_API: Record<RecordListFilter, 'ALL' | ApiRecordType> = {
  all: 'ALL',
  saved: 'SKIPPED',
  consume: 'CONSUMED',
}

export interface ConsumptionRecordInput {
  type: RecordType
  productName: string
  price: number
  category?: string
  reason?: string
  riskScore?: number
  productUrl?: string
  interventionAnswers?: InterventionAnswer[]
}

function toRequestBody(input: ConsumptionRecordInput): PostApiV1ConsumptionRecordsData['body'] {
  return {
    type: TYPE_TO_API[input.type],
    productName: input.productName,
    price: input.price,
    ...(input.category && { category_code: CATEGORY_LABEL_TO_CODE[input.category] }),
    ...(input.reason && { reason: input.reason }),
    ...(input.riskScore !== undefined && { riskScore: input.riskScore }),
    ...(input.productUrl && { productUrl: input.productUrl }),
    ...(input.interventionAnswers && {
      interventionAnswers: input.interventionAnswers.map(({ questionId, answerValue }) => ({
        questionId: Number(questionId),
        answerValue,
      })),
    }),
  }
}

function adaptRecord(result: ConsumptionRecordResult): RecordItem {
  return {
    id: result.id,
    title: result.productName,
    category: result.categoryLabel,
    amount: result.price ?? 0,
    type: TYPE_TO_FRONT[result.type],
    date: formatDateKorean(result.occurredAt),
    occurredAt: result.occurredAt,
    reason: result.reason ?? undefined,
  }
}

export const consumptionRecordApi = {
  getList: async (filter: RecordListFilter = 'all'): Promise<RecordItem[]> => {
    const { data } = await client.get<ApiResponse<ConsumptionRecordResult[]>>(
      '/api/v1/consumption-records',
      { params: { type: FILTER_TO_API[filter] } },
    )
    return data.data.map(adaptRecord)
  },

  getDetail: async (id: string): Promise<RecordDetail> => {
    const { data } = await client.get<ApiResponse<ConsumptionRecordDetailResult>>(
      `/api/v1/consumption-records/${id}`,
    )
    return {
      ...adaptRecord(data.data),
      recentCategoryConsumptionCount: data.data.recentCategoryConsumptionCount,
      recentCategoryConsumptions: data.data.recentCategoryConsumptions.map(adaptRecord),
    }
  },

  getRatio: async (): Promise<ConsumptionRatio> => {
    const { data } = await client.get<ApiResponse<ConsumptionRatioResult>>(
      '/api/v1/consumption-records/ratio',
    )
    const { totalAmount, skippedAmount, consumedAmount, skippedRatio, consumedRatio } = data.data
    return { totalAmount, skippedAmount, consumedAmount, skippedRatio, consumedRatio }
  },

  create: async (input: ConsumptionRecordInput): Promise<RecordItem> => {
    const { data } = await client.post<ApiResponse<ConsumptionRecordResult>>(
      '/api/v1/consumption-records',
      toRequestBody(input),
    )
    return adaptRecord(data.data)
  },

  update: async (id: string, input: ConsumptionRecordInput): Promise<RecordItem> => {
    const { data } = await client.put<ApiResponse<ConsumptionRecordResult>>(
      `/api/v1/consumption-records/${id}`,
      toRequestBody(input),
    )
    return adaptRecord(data.data)
  },

  remove: async (id: string): Promise<void> => {
    await client.delete(`/api/v1/consumption-records/${id}`)
  },
}
