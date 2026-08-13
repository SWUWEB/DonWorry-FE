import { describe, expect, it, vi } from 'vitest'
import client from '@/api/client'
import { consumptionRecordApi } from './consumptionRecordApi'

vi.mock('@/api/client', () => ({
  default: { get: vi.fn() },
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
})
