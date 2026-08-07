import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NotificationSettingsSheet from './NotificationSettingsSheet'
import { useNotificationSettings, useUpdateNotificationSettings } from '../hooks/useNotifications'

vi.mock('../hooks/useNotifications', () => ({
  useNotificationSettings: vi.fn(),
  useUpdateNotificationSettings: vi.fn(),
}))

const mockedUseNotificationSettings = vi.mocked(useNotificationSettings)
const mockedUseUpdateNotificationSettings = vi.mocked(useUpdateNotificationSettings)

const mutate = vi.fn()

function mockServerSettings(data: { all: boolean; general: boolean; goal: boolean; retrial: boolean }) {
  mockedUseNotificationSettings.mockReturnValue({ data } as unknown as ReturnType<typeof useNotificationSettings>)
}

describe('NotificationSettingsSheet 전체 알림 마스터 토글', () => {
  beforeEach(() => {
    mutate.mockClear()
    mockedUseUpdateNotificationSettings.mockReturnValue(
      { mutate } as unknown as ReturnType<typeof useUpdateNotificationSettings>,
    )
    mockServerSettings({ all: true, general: true, goal: true, retrial: true })
  })

  it('세 항목이 모두 켜져 있으면 전체 알림도 켜진 상태로 보인다', () => {
    render(<NotificationSettingsSheet onClose={() => {}} />)

    expect(screen.getByRole('button', { name: '전체 알림 끄기' })).toBeInTheDocument()
  })

  it('하위 항목 하나를 끄면 전체 알림이 꺼진 상태로 바뀐다', async () => {
    const user = userEvent.setup()
    render(<NotificationSettingsSheet onClose={() => {}} />)

    await user.click(screen.getByRole('button', { name: '유혹 관리 알림 끄기' }))

    expect(screen.getByRole('button', { name: '전체 알림 켜기' })).toBeInTheDocument()
    expect(mutate).toHaveBeenCalledWith({ general: true, goal: true, retrial: false, all: false })
  })

  it('전체 알림을 끄면 하위 세 항목이 모두 꺼진다', async () => {
    const user = userEvent.setup()
    render(<NotificationSettingsSheet onClose={() => {}} />)

    await user.click(screen.getByRole('button', { name: '전체 알림 끄기' }))

    expect(screen.getByRole('button', { name: '유혹 관리 알림 켜기' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '목표 현황 알림 켜기' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '일반 알림 켜기' })).toBeInTheDocument()
    expect(mutate).toHaveBeenCalledWith({ general: false, goal: false, retrial: false, all: false })
  })

  it('일부만 켜진 상태에서 전체 알림을 누르면 하위 항목이 모두 켜진다', async () => {
    mockServerSettings({ all: false, general: true, goal: false, retrial: true })
    const user = userEvent.setup()
    render(<NotificationSettingsSheet onClose={() => {}} />)

    await user.click(screen.getByRole('button', { name: '전체 알림 켜기' }))

    expect(mutate).toHaveBeenCalledWith({ general: true, goal: true, retrial: true, all: true })
  })
})
