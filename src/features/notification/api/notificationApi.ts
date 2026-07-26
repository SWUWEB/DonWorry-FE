import type { NotificationItem } from '../components/NotificationCard'

// TODO: 백엔드 응답 타입으로 교체
export interface NotificationResponse {
  id: number
  type: 'GENERAL' | 'GOAL' | 'RETRIAL'
  title: string
  body: string
  createdAt: string
  isRead: boolean
}

export interface NotificationSettingsResponse {
  all: boolean
  general: boolean
  goal: boolean
  retrial: boolean
}

// ─── Mock 데이터 (API 연결 후 제거) ────────────────────────────────────────
// id가 클수록 최신 알림 (최신순 정렬 기준: b.id - a.id)
let mockNotifications: NotificationItem[] = [
  {
    id: 1,
    type: '재판단',
    iconVariant: 'heart',
    title: '새로운 유혹이 추가됨',
    description: "'미스치프 후드티'를 위시리스트에 담았습니다. 1일 뒤에 다시 물어볼게요!",
    time: '4월 28일',
    isRead: true,
  },
  {
    id: 2,
    type: '재판단',
    iconVariant: 'heart',
    title: '새로운 유혹이 추가됨',
    description: "'스타벅스 텀블러'를 위시리스트에 담았습니다. 1일 뒤에 다시 물어볼게요!",
    time: '4월 30일',
    isRead: true,
  },
  {
    id: 3,
    type: '일반',
    iconVariant: 'calendar',
    title: '4월 월간 리포트 도착',
    description: '지난달 나의 소비 통제력 점수를 확인해 보세요.',
    time: '1시간 전',
    isRead: true,
  },
  {
    id: 4,
    type: '목표현황',
    iconVariant: 'check',
    title: '목표 달성률 70% 돌파!',
    description: '제주도 항공권까지 얼마 남지 않았어요! 조금만 더 힘내세요.',
    time: '방금 전',
    isRead: false,
  },
  {
    id: 5,
    type: '재판단',
    iconVariant: 'lightning',
    title: '결단의 시간이 왔어요!',
    description: "'아이폰 17 Pro' 대기 시간이 끝났어요. 아직도 사고 싶으신가요?",
    time: '방금 전',
    isRead: false,
  },
]

let mockSettings: NotificationSettingsResponse = {
  all: true, general: true, goal: true, retrial: true,
}
// ──────────────────────────────────────────────────────────────────────────

export const notificationApi = {
  getList: async (): Promise<NotificationItem[]> => {
    // TODO: API 연결 시 아래 두 줄로 교체하고 mockNotifications 제거
    // const { data } = await client.get<NotificationResponse[]>('/notifications')
    // return data.map(adaptNotification)
    return mockNotifications
  },

  deleteOne: async (id: number): Promise<void> => {
    // TODO: API 연결 시 아래 줄로 교체하고 mock 제거
    // await client.delete(`/notifications/${id}`)
    mockNotifications = mockNotifications.filter((n) => n.id !== id)
  },

  getSettings: async (): Promise<NotificationSettingsResponse> => {
    // TODO: API 연결 시 아래 두 줄로 교체하고 mockSettings 제거
    // const { data } = await client.get<NotificationSettingsResponse>('/notifications/settings')
    // return data
    return { ...mockSettings }
  },

  updateSettings: async (settings: NotificationSettingsResponse): Promise<void> => {
    // TODO: API 연결 시 아래 줄로 교체하고 mock 제거
    // await client.put('/notifications/settings', settings)
    mockSettings = { ...settings }
  },
}

// TODO: 백엔드 타입 → 프론트 타입 변환 (API 연결 시 주석 해제)
// function adaptNotification(item: NotificationResponse): NotificationItem {
//   const TYPE_MAP = { GENERAL: '일반', GOAL: '목표현황', RETRIAL: '재판단' } as const
//   const ICON_MAP = { GENERAL: 'calendar', GOAL: 'check', RETRIAL: 'lightning' } as const
//   return {
//     id: item.id,
//     type: TYPE_MAP[item.type],
//     iconVariant: ICON_MAP[item.type],
//     title: item.title,
//     description: item.body,
//     time: formatTime(item.createdAt),  // TODO: formatTime 유틸 구현
//     isRead: item.isRead,
//   }
// }
