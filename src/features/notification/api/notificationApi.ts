import client from '@/api/client'
import type { NotificationItem } from '../components/NotificationCard'

// ─── API 응답 타입 ────────────────────────────────────────────────────────────

interface NotificationResult {
  id: string
  notificationType: 'TEMPTATION' | 'GOAL' | 'GENERAL'
  isRead: boolean
  readAt: string | null
  wishlistItemId: string | null
  createdAt: string
}

export interface NotificationSettingsResponse {
  all: boolean
  general: boolean
  goal: boolean
  retrial: boolean
}

const NOTIFICATION_SETTINGS_URL = '/api/v1/users/me/notification-settings'

interface NotificationSettingsResult {
  notifyGeneralEnabled: boolean
  notifyGoalEnabled: boolean
  notifyTemptationEnabled: boolean
  notifyPushEnabled: boolean
}

function adaptSettings(result: NotificationSettingsResult): NotificationSettingsResponse {
  return {
    all: result.notifyPushEnabled,
    general: result.notifyGeneralEnabled,
    goal: result.notifyGoalEnabled,
    retrial: result.notifyTemptationEnabled,
  }
}

// ─── 어댑터 유틸 ──────────────────────────────────────────────────────────────

const TYPE_MAP = {
  TEMPTATION: '유혹관리',
  GOAL: '목표현황',
  GENERAL: '일반',
} as const

const ICON_MAP = {
  TEMPTATION: 'lightning',
  GOAL: 'check',
  GENERAL: 'calendar',
} as const

const CONTENT_MAP = {
  TEMPTATION: { title: '유혹 관리 알림', description: '위시리스트 관련 알림이 도착했습니다.' },
  GOAL: { title: '목표 현황 알림', description: '절약 목표 진행 상황을 확인하세요.' },
  GENERAL: { title: '일반 알림', description: '서비스 소식을 확인하세요.' },
} as const

// 서버 시각(createdAt)은 KST 기준 계약이므로, 브라우저 로컬 시간대와 무관하게 항상 서울 기준으로 표기합니다.
const KST_MONTH_DAY = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul',
  month: 'numeric',
  day: 'numeric',
})

function formatTime(isoString: string): string {
  const date = new Date(isoString)
  const diffMins = Math.floor((Date.now() - date.getTime()) / 60000)
  if (diffMins < 1) return '방금 전'
  if (diffMins < 60) return `${diffMins}분 전`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}시간 전`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays}일 전`

  const parts = KST_MONTH_DAY.formatToParts(date)
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? ''
  return `${get('month')}월 ${get('day')}일`
}

function adapt(n: NotificationResult): NotificationItem {
  const { title, description } = CONTENT_MAP[n.notificationType]
  return {
    id: n.id,
    type: TYPE_MAP[n.notificationType],
    iconVariant: ICON_MAP[n.notificationType],
    title,
    description,
    time: formatTime(n.createdAt),
    isRead: n.isRead,
  }
}

// ─── API ──────────────────────────────────────────────────────────────────────

export const notificationApi = {
  getList: async (type = 'ALL', sort = 'LATEST'): Promise<NotificationItem[]> => {
    const { data } = await client.get<{ data: NotificationResult[] }>('/api/v1/notifications', {
      params: { type, sort },
    })
    return data.data.map(adapt)
  },

  readOne: async (id: string): Promise<void> => {
    await client.patch(`/api/v1/notifications/${id}/read`)
  },

  readAll: async (): Promise<void> => {
    await client.patch('/api/v1/notifications/read-all')
  },

  getSettings: async (): Promise<NotificationSettingsResponse> => {
    const { data } = await client.get<{ data: NotificationSettingsResult }>(
      NOTIFICATION_SETTINGS_URL,
    )
    return adaptSettings(data.data)
  },

  updateAllSetting: async (enabled: boolean): Promise<NotificationSettingsResponse> => {
    const { data } = await client.patch<{ data: NotificationSettingsResult }>(
      NOTIFICATION_SETTINGS_URL,
      { notifyPushEnabled: enabled },
    )
    return adaptSettings(data.data)
  },

  updateSubSettings: async (
    settings: Omit<NotificationSettingsResponse, 'all'>,
  ): Promise<NotificationSettingsResponse> => {
    const { data } = await client.patch<{ data: NotificationSettingsResult }>(
      NOTIFICATION_SETTINGS_URL,
      {
        notifyGeneralEnabled: settings.general,
        notifyGoalEnabled: settings.goal,
        notifyTemptationEnabled: settings.retrial,
      },
    )
    return adaptSettings(data.data)
  },
}
