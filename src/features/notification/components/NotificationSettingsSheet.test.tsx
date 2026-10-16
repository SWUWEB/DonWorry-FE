import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NotificationSettingsSheet from './NotificationSettingsSheet'
import {
  useNotificationSettings,
  useUpdateAllSetting,
  useUpdateSubSettings,
} from '../hooks/useNotifications'

vi.mock('../hooks/useNotifications', () => ({
  useNotificationSettings: vi.fn(),
  useUpdateAllSetting: vi.fn(),
  useUpdateSubSettings: vi.fn(),
}))

const mockedUseNotificationSettings = vi.mocked(useNotificationSettings)
const mockedUseUpdateAllSetting = vi.mocked(useUpdateAllSetting)
const mockedUseUpdateSubSettings = vi.mocked(useUpdateSubSettings)

const updateAll = vi.fn()
const updateSub = vi.fn()
const refetchSettings = vi.fn()

function mockServerSettings(data: {
  all: boolean
  general: boolean
  goal: boolean
  retrial: boolean
}) {
  mockedUseNotificationSettings.mockReturnValue({ data } as unknown as ReturnType<
    typeof useNotificationSettings
  >)
}

function mockMutations({ isPending = false } = {}) {
  mockedUseUpdateAllSetting.mockReturnValue({
    mutate: updateAll,
    isPending,
  } as unknown as ReturnType<typeof useUpdateAllSetting>)
  mockedUseUpdateSubSettings.mockReturnValue({
    mutate: updateSub,
    isPending: false,
  } as unknown as ReturnType<typeof useUpdateSubSettings>)
}

describe('NotificationSettingsSheet 전체 알림 마스터 토글', () => {
  beforeEach(() => {
    updateAll.mockClear()
    updateSub.mockClear()
    refetchSettings.mockClear()
    mockMutations()
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
    expect(updateSub).toHaveBeenCalledWith(
      { general: true, goal: true, retrial: false },
      expect.anything(),
    )
  })

  it('하위 항목 변경은 전체 알림 API를 호출하지 않는다', async () => {
    const user = userEvent.setup()
    render(<NotificationSettingsSheet onClose={() => {}} />)

    await user.click(screen.getByRole('button', { name: '유혹 관리 알림 끄기' }))

    expect(updateAll).not.toHaveBeenCalled()
  })

  it('전체 알림을 끄면 하위 세 항목이 모두 꺼지고 전체 알림 API만 호출한다', async () => {
    const user = userEvent.setup()
    render(<NotificationSettingsSheet onClose={() => {}} />)

    await user.click(screen.getByRole('button', { name: '전체 알림 끄기' }))

    expect(screen.getByRole('button', { name: '유혹 관리 알림 켜기' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '목표 현황 알림 켜기' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '일반 알림 켜기' })).toBeInTheDocument()
    expect(updateAll).toHaveBeenCalledWith(false, expect.anything())
    expect(updateSub).not.toHaveBeenCalled()
  })

  it('일부만 켜진 상태에서 전체 알림을 누르면 하위 항목이 모두 켜진다', async () => {
    mockServerSettings({ all: false, general: true, goal: false, retrial: true })
    const user = userEvent.setup()
    render(<NotificationSettingsSheet onClose={() => {}} />)

    await user.click(screen.getByRole('button', { name: '전체 알림 켜기' }))

    expect(updateAll).toHaveBeenCalledWith(true, expect.anything())
  })

  it('저장 요청이 진행 중이면 토글이 잠겨 추가 요청을 보내지 않는다', async () => {
    mockMutations({ isPending: true })
    const user = userEvent.setup()
    render(<NotificationSettingsSheet onClose={() => {}} />)

    await user.click(screen.getByRole('button', { name: '유혹 관리 알림 끄기' }))

    expect(updateSub).not.toHaveBeenCalled()
    expect(updateAll).not.toHaveBeenCalled()
  })

  it('저장에 실패하면 토글이 이전 상태로 되돌아가고 안내 문구가 뜬다', async () => {
    updateSub.mockImplementation((_settings, options) => options?.onError?.(new Error('failed')))
    const user = userEvent.setup()
    render(<NotificationSettingsSheet onClose={() => {}} />)

    await user.click(screen.getByRole('button', { name: '유혹 관리 알림 끄기' }))

    expect(screen.getByRole('button', { name: '유혹 관리 알림 끄기' })).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent('설정을 저장하지 못했어요')
  })

  it('설정 조회에 실패하면 토글을 잠그고 다시 조회할 수 있다', async () => {
    mockedUseNotificationSettings.mockReturnValue({
      isError: true,
      refetch: refetchSettings,
    } as unknown as ReturnType<typeof useNotificationSettings>)
    const user = userEvent.setup()

    render(<NotificationSettingsSheet onClose={() => {}} />)

    expect(screen.getByRole('button', { name: '전체 알림 끄기' })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: '다시 시도' }))
    expect(refetchSettings).toHaveBeenCalledOnce()
  })

  it('설정 조회의 최종 401 응답이면 로그인 이동을 안내한다', async () => {
    const onUnauthorized = vi.fn()
    mockedUseNotificationSettings.mockReturnValue({
      isError: true,
      error: { isAxiosError: true, response: { status: 401 } },
      refetch: refetchSettings,
    } as unknown as ReturnType<typeof useNotificationSettings>)
    const user = userEvent.setup()

    render(<NotificationSettingsSheet onClose={() => {}} onUnauthorized={onUnauthorized} />)

    await user.click(screen.getByRole('button', { name: '로그인하기' }))
    expect(onUnauthorized).toHaveBeenCalledOnce()
  })
})
