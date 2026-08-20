import { describe, expect, it, vi } from 'vitest'
import client from '@/api/client'
import { interventionApi } from './interventionApi'

vi.mock('@/api/client', () => ({
  default: { get: vi.fn(), post: vi.fn() },
}))

describe('interventionApi', () => {
  it('getQuestions: category_code로 변환해 쿼리파라미터로 전달하고, sortOrder 기준으로 정렬한다', async () => {
    vi.mocked(client.get).mockResolvedValueOnce({
      data: {
        success: true,
        message: 'OK',
        data: {
          questions: [
            {
              questionId: '2',
              questionText: 'Q2',
              description: '설명2',
              sortOrder: 2,
              options: [
                { answerValue: false, label: '아니요' },
                { answerValue: true, label: '네' },
              ],
            },
            {
              questionId: '1',
              questionText: 'Q1',
              description: '설명1',
              sortOrder: 1,
              options: [
                { answerValue: false, label: '아니요' },
                { answerValue: true, label: '네' },
              ],
            },
          ],
          recentCategoryConsumption: {
            categoryCode: 'FASHION',
            totalCount: 2,
            records: [
              {
                consumptionRecordId: '10',
                productName: 'ZARA 반팔티',
                price: 23900,
                occurredAt: '2026-04-17T12:00:00.000Z',
              },
            ],
          },
        },
      },
    })

    const result = await interventionApi.getQuestions('패션')

    expect(client.get).toHaveBeenCalledWith('/api/v1/intervention-questions', {
      params: { category_code: 'FASHION' },
    })
    expect(result.questions.map((q) => q.questionId)).toEqual(['1', '2'])
    expect(result.recentCategoryConsumptionCount).toBe(2)
    expect(result.recentCategoryConsumptions).toEqual([
      {
        id: '10',
        title: 'ZARA 반팔티',
        date: '2026년 4월 17일',
        amount: 23900,
      },
    ])
  })

  it('getRiskScore: interventionAnswers를 그대로 전달하고 riskLevel을 소문자로 매핑한다', async () => {
    vi.mocked(client.post).mockResolvedValueOnce({
      data: {
        success: true,
        message: 'OK',
        data: {
          riskScore: 4,
          riskLevel: 'HIGH',
          riskMessage: '충동적인 소비일 가능성이 높아요.',
        },
      },
    })

    const answers = [
      { questionId: '1', answerValue: true },
      { questionId: '2', answerValue: false },
    ]

    const result = await interventionApi.getRiskScore(answers)

    expect(client.post).toHaveBeenCalledWith('/api/v1/interventions/risk-score', {
      interventionAnswers: answers,
    })
    expect(result).toEqual({
      riskScore: 4,
      riskLevel: 'high',
      riskMessage: '충동적인 소비일 가능성이 높아요.',
    })
  })
})
