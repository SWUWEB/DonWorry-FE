export type RecordType = 'saved' | 'consume'

export interface RecordItem {
  id: string
  title: string
  category: string
  amount: number
  type: RecordType
  date: string
  occurredAt: string
  reason?: string
  thumbnail?: string
}

// 하드코딩됨. API 연결 시 수정 예정
export const MOCK_RECORDS: RecordItem[] = [
  {
    id: '1',
    title: '투썸플레이스 신봉점',
    category: '카페/디저트',
    amount: 6100,
    type: 'saved',
    date: '2026년 4월 17일',
    occurredAt: '2026-04-17T00:00:00.000Z',
    reason: '스트레스 받아서',
  },
  {
    id: '2',
    title: 'ZARA 반팔티',
    category: '패션',
    amount: 23900,
    type: 'consume',
    date: '2026년 4월 17일',
    occurredAt: '2026-04-17T00:00:00.000Z',
    reason: '계절이 바뀌어서',
  },
  {
    id: '3',
    title: '무신사',
    category: '패션',
    amount: 35000,
    type: 'saved',
    date: '2026년 4월 14일',
    occurredAt: '2026-04-14T00:00:00.000Z',
    reason: '세일해서',
  },
]
