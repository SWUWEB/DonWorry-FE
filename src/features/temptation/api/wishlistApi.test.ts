import { describe, it, expect, vi } from 'vitest'
import client from '@/api/client'
import { fetchWishlistItems } from './wishlistApi'

vi.mock('@/api/client')

describe('wishlistApi', () => {
  it('서버 응답을 Product 형태로 변환 및 반환', async () => {
    vi.mocked(client.get).mockResolvedValueOnce({
      data: {
        success: true,
        data: [
          {
            id: '1',
            userId: '1',
            categoryCode: 'ELECTRONICS',
            productName: '맥북 프로',
            productUrl: 'https://apple.com/kr/macbook',
            price: '2500000',
            productImageUrl: 'https://images.com/macbook.png',
            reason: '개발 작업용 스펙 업그레이드',
            waitType: '1W',
            waitUntil: '2026-07-23T18:00:00.000Z',
            status: 'WAITING',
            createdAt: '2026-07-16T18:00:00.000Z',
            updatedAt: '2026-07-16T18:00:00.000Z',
          },
        ],
      },
    })

    const result = await fetchWishlistItems()

    expect(result).toEqual([
      {
        id: '1',
        name: '맥북 프로',
        price: 2500000,
        time: new Date('2026-07-23T18:00:00.000Z'),
        timeOption: '7일',
        category: '전자기기',
        link: 'https://apple.com/kr/macbook',
        reason: '개발 작업용 스펙 업그레이드',
        createdAt: new Date('2026-07-16T18:00:00.000Z'),
      },
    ])
  })
})
