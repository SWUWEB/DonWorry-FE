import { describe, expect, it, vi } from 'vitest'
import client from '@/api/client'
import { consumptionRecordApi } from './consumptionRecordApi'

vi.mock('@/api/client', () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))

describe('consumptionRecordApi', () => {
  it('getList: SKIPPED/CONSUMED을 saved/consume으로 매핑하고 날짜를 한글로 변환한다', async () => {
    vi.mocked(client.get).mockResolvedValueOnce({
      data: {
        success: true,
        message: 'OK',
        data: [
          {
            id: '1',
            type: 'SKIPPED',
            productName: '투썸플레이스 신봉점',
            price: 6100,
            categoryCode: 'CAFE_DESSERT',
            categoryLabel: '카페/디저트',
            reason: '스트레스 받아서',
            occurredAt: '2026-04-17T12:00:00.000Z',
          },
        ],
      },
    })

    const result = await consumptionRecordApi.getList('all')

    expect(client.get).toHaveBeenCalledWith('/api/v1/consumption-records', {
      params: { type: 'ALL' },
    })
    expect(result).toEqual([
      {
        id: '1',
        title: '투썸플레이스 신봉점',
        category: '카페/디저트',
        amount: 6100,
        type: 'saved',
        date: '2026년 4월 17일',
        occurredAt: '2026-04-17T12:00:00.000Z',
        reason: '스트레스 받아서',
      },
    ])
  })

  it('getList: 필터를 API enum(SKIPPED/CONSUMED)으로 변환해 쿼리파라미터로 전달한다', async () => {
    vi.mocked(client.get).mockResolvedValueOnce({
      data: { success: true, message: 'OK', data: [] },
    })

    await consumptionRecordApi.getList('saved')

    expect(client.get).toHaveBeenCalledWith('/api/v1/consumption-records', {
      params: { type: 'SKIPPED' },
    })
  })

  it('getList: price가 null이면 0으로, reason이 null이면 undefined로 처리한다', async () => {
    vi.mocked(client.get).mockResolvedValueOnce({
      data: {
        success: true,
        message: 'OK',
        data: [
          {
            id: '2',
            type: 'CONSUMED',
            productName: '쿠팡 상품',
            price: null,
            categoryCode: 'FASHION',
            categoryLabel: '패션',
            reason: null,
            occurredAt: '2026-04-17T12:00:00.000Z',
          },
        ],
      },
    })

    const [result] = await consumptionRecordApi.getList()

    expect(result.amount).toBe(0)
    expect(result.reason).toBeUndefined()
  })

  it('getDetail: recentCategoryConsumptions도 동일한 규칙으로 매핑한다', async () => {
    vi.mocked(client.get).mockResolvedValueOnce({
      data: {
        success: true,
        message: 'OK',
        data: {
          id: '1',
          type: 'CONSUMED',
          productName: 'ZARA 반팔티',
          price: 23900,
          categoryCode: 'FASHION',
          categoryLabel: '패션',
          reason: '계절이 바뀌어서',
          occurredAt: '2026-04-17T12:00:00.000Z',
          recentCategoryConsumptionCount: 1,
          recentCategoryConsumptions: [
            {
              id: '3',
              type: 'SKIPPED',
              productName: '무신사',
              price: 35000,
              categoryCode: 'FASHION',
              categoryLabel: '패션',
              reason: '세일해서',
              occurredAt: '2026-04-14T12:00:00.000Z',
            },
          ],
        },
      },
    })

    const result = await consumptionRecordApi.getDetail('1')

    expect(client.get).toHaveBeenCalledWith('/api/v1/consumption-records/1')
    expect(result.title).toBe('ZARA 반팔티')
    expect(result.recentCategoryConsumptions).toEqual([
      {
        id: '3',
        title: '무신사',
        category: '패션',
        amount: 35000,
        type: 'saved',
        date: '2026년 4월 14일',
        occurredAt: '2026-04-14T12:00:00.000Z',
        reason: '세일해서',
      },
    ])
  })

  it('getRatio: 응답의 비율/금액 필드를 그대로 반환한다', async () => {
    vi.mocked(client.get).mockResolvedValueOnce({
      data: {
        success: true,
        message: 'OK',
        data: {
          period: { startDate: '2026-03-21', endDate: '2026-04-17', days: 28 },
          totalAmount: 148500,
          skippedAmount: 96500,
          consumedAmount: 52000,
          skippedRatio: 65,
          consumedRatio: 35,
        },
      },
    })

    const result = await consumptionRecordApi.getRatio()

    expect(client.get).toHaveBeenCalledWith('/api/v1/consumption-records/ratio')
    expect(result).toEqual({
      totalAmount: 148500,
      skippedAmount: 96500,
      consumedAmount: 52000,
      skippedRatio: 65,
      consumedRatio: 35,
    })
  })

  it('getDetail: recentCategoryConsumptionCount는 배열 길이가 아니라 API 응답값을 그대로 사용한다', async () => {
    vi.mocked(client.get).mockResolvedValueOnce({
      data: {
        success: true,
        message: 'OK',
        data: {
          id: '1',
          type: 'CONSUMED',
          productName: 'ZARA 반팔티',
          price: 23900,
          categoryCode: 'FASHION',
          categoryLabel: '패션',
          reason: null,
          occurredAt: '2026-04-17T12:00:00.000Z',
          // 응답 배열은 최근 1건만 담고 있지만, 실제 총 건수는 5건인 상황을 가정합니다.
          recentCategoryConsumptionCount: 5,
          recentCategoryConsumptions: [
            {
              id: '3',
              type: 'SKIPPED',
              productName: '무신사',
              price: 35000,
              categoryCode: 'FASHION',
              categoryLabel: '패션',
              reason: null,
              occurredAt: '2026-04-14T12:00:00.000Z',
            },
          ],
        },
      },
    })

    const result = await consumptionRecordApi.getDetail('1')

    expect(result.recentCategoryConsumptionCount).toBe(5)
    expect(result.recentCategoryConsumptions).toHaveLength(1)
  })

  it('create: saved/consume을 SKIPPED/CONSUMED로, 카테고리 라벨을 코드로 변환해 전송한다', async () => {
    vi.mocked(client.post).mockResolvedValueOnce({
      data: {
        success: true,
        message: '소비 기록 생성에 성공했습니다.',
        data: {
          id: '1',
          type: 'SKIPPED',
          productName: '무선 이어폰',
          price: 150000,
          categoryCode: 'ELECTRONICS',
          categoryLabel: '전자기기',
          reason: '비슷한 걸 이미 가지고 있어서',
          occurredAt: '2026-08-09T12:00:00.000Z',
        },
      },
    })

    const result = await consumptionRecordApi.create({
      type: 'saved',
      productName: '무선 이어폰',
      price: 150000,
      category: '전자기기',
      reason: '비슷한 걸 이미 가지고 있어서',
    })

    expect(client.post).toHaveBeenCalledWith('/api/v1/consumption-records', {
      type: 'SKIPPED',
      productName: '무선 이어폰',
      price: 150000,
      category_code: 'ELECTRONICS',
      reason: '비슷한 걸 이미 가지고 있어서',
    })
    expect(result.type).toBe('saved')
    expect(result.category).toBe('전자기기')
  })

  it('create: category/reason/riskScore가 없으면 요청 바디에 포함하지 않는다', async () => {
    vi.mocked(client.post).mockResolvedValueOnce({
      data: {
        success: true,
        message: 'OK',
        data: {
          id: '2',
          type: 'CONSUMED',
          productName: '아메리카노',
          price: 4500,
          categoryCode: null,
          categoryLabel: null,
          reason: null,
          occurredAt: '2026-08-09T12:00:00.000Z',
        },
      },
    })

    await consumptionRecordApi.create({ type: 'consume', productName: '아메리카노', price: 4500 })

    expect(client.post).toHaveBeenCalledWith('/api/v1/consumption-records', {
      type: 'CONSUMED',
      productName: '아메리카노',
      price: 4500,
    })
  })

  it('update: PUT으로 요청하고 응답을 프론트 타입으로 변환한다', async () => {
    vi.mocked(client.put).mockResolvedValueOnce({
      data: {
        success: true,
        message: 'OK',
        data: {
          id: '1',
          type: 'CONSUMED',
          productName: '수정된 상품명',
          price: 10000,
          categoryCode: 'FASHION',
          categoryLabel: '패션',
          reason: null,
          occurredAt: '2026-08-09T12:00:00.000Z',
        },
      },
    })

    const result = await consumptionRecordApi.update('1', {
      type: 'consume',
      productName: '수정된 상품명',
      price: 10000,
      category: '패션',
    })

    expect(client.put).toHaveBeenCalledWith('/api/v1/consumption-records/1', {
      type: 'CONSUMED',
      productName: '수정된 상품명',
      price: 10000,
      category_code: 'FASHION',
    })
    expect(result.title).toBe('수정된 상품명')
  })

  it('remove: DELETE로 요청한다', async () => {
    vi.mocked(client.delete).mockResolvedValueOnce({ data: { success: true } })

    await consumptionRecordApi.remove('1')

    expect(client.delete).toHaveBeenCalledWith('/api/v1/consumption-records/1')
  })

  it('create: productUrl이 있으면 요청 바디에 포함한다', async () => {
    vi.mocked(client.post).mockResolvedValueOnce({
      data: {
        success: true,
        message: 'OK',
        data: {
          id: '3',
          type: 'CONSUMED',
          productName: '캠핑 의자',
          price: 45000,
          categoryCode: 'HOBBY_GOODS',
          categoryLabel: '취미/굿즈',
          reason: null,
          occurredAt: '2026-08-09T12:00:00.000Z',
        },
      },
    })

    await consumptionRecordApi.create({
      type: 'consume',
      productName: '캠핑 의자',
      price: 45000,
      productUrl: 'https://example.com/products/chair',
    })

    expect(client.post).toHaveBeenCalledWith('/api/v1/consumption-records', {
      type: 'CONSUMED',
      productName: '캠핑 의자',
      price: 45000,
      productUrl: 'https://example.com/products/chair',
    })
  })

  it('create: 개입 답변 questionId를 Swagger 계약의 정수로 변환한다', async () => {
    vi.mocked(client.post).mockResolvedValueOnce({
      data: {
        success: true,
        message: 'OK',
        data: {
          id: '4',
          type: 'CONSUMED',
          productName: '헤드폰',
          price: 200000,
          categoryCode: 'ELECTRONICS',
          categoryLabel: '전자기기',
          reason: null,
          occurredAt: '2026-08-09T12:00:00.000Z',
        },
      },
    })

    await consumptionRecordApi.create({
      type: 'consume',
      productName: '헤드폰',
      price: 200000,
      interventionAnswers: [{ questionId: '12', answerValue: true }],
    })

    expect(client.post).toHaveBeenCalledWith('/api/v1/consumption-records', {
      type: 'CONSUMED',
      productName: '헤드폰',
      price: 200000,
      interventionAnswers: [{ questionId: 12, answerValue: true }],
    })
  })
})
