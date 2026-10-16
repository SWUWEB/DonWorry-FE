import { describe, expect, it, vi } from 'vitest'
import client from '@/api/client'
import { productUrlApi } from './productUrlApi'

vi.mock('@/api/client', () => ({
  default: { post: vi.fn() },
}))

describe('productUrlApi', () => {
  it('parse: 요청 바디에 productUrl을 담아 보내고 응답 데이터를 그대로 반환한다', async () => {
    vi.mocked(client.post).mockResolvedValueOnce({
      data: {
        success: true,
        message: 'url 파싱에 성공했습니다.',
        data: {
          productName: '투썸플레이스 신봉점',
          price: 6100,
          occurredAt: '2026-05-17T12:00:00.000Z',
        },
      },
    })

    const result = await productUrlApi.parse('https://example.com/products/123')

    expect(client.post).toHaveBeenCalledWith('/api/v1/product-url/parse', {
      productUrl: 'https://example.com/products/123',
    })
    expect(result).toEqual({
      productName: '투썸플레이스 신봉점',
      price: 6100,
      occurredAt: '2026-05-17T12:00:00.000Z',
    })
  })
})
