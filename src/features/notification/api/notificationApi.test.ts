import { beforeEach, describe, expect, it, vi } from 'vitest'
import client from '@/api/client'
import { notificationApi } from './notificationApi'

vi.mock('@/api/client', () => ({
  default: { get: vi.fn(), patch: vi.fn(), delete: vi.fn() },
}))

describe('notificationApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('서버가 내려준 알림 제목과 본문을 화면 모델에 반영한다', async () => {
    vi.mocked(client.get).mockResolvedValueOnce({
      data: {
        data: [
          {
            id: 'notification-1',
            notificationType: 'TEMPTATION',
            title: '다시 고민할 시간이에요',
            body: '위시리스트의 운동화를 다시 확인해보세요.',
            isRead: false,
            readAt: null,
            notifyAt: '2026-09-04T09:00:00.000Z',
            wishlistItemId: 'wishlist-1',
            createdAt: new Date().toISOString(),
          },
        ],
      },
    })

    const result = await notificationApi.getList('TEMPTATION', 'LATEST')

    expect(client.get).toHaveBeenCalledWith('/api/v1/notifications', {
      params: { type: 'TEMPTATION', sort: 'LATEST' },
    })
    expect(result[0]).toEqual(
      expect.objectContaining({
        id: 'notification-1',
        title: '다시 고민할 시간이에요',
        description: '위시리스트의 운동화를 다시 확인해보세요.',
      }),
    )
  })

  it('서버 문구가 비어 있으면 알림 종류별 기본 문구를 사용한다', async () => {
    vi.mocked(client.get).mockResolvedValueOnce({
      data: {
        data: [
          {
            id: 'notification-2',
            notificationType: 'GOAL',
            title: '',
            body: '',
            isRead: true,
            readAt: '2026-09-04T09:05:00.000Z',
            notifyAt: '2026-09-04T09:00:00.000Z',
            wishlistItemId: null,
            createdAt: new Date().toISOString(),
          },
        ],
      },
    })

    const result = await notificationApi.getList()

    expect(result[0]).toEqual(
      expect.objectContaining({
        title: '목표 현황 알림',
        description: '절약 목표 진행 상황을 확인하세요.',
      }),
    )
  })
})
