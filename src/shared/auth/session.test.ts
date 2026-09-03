import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  clearAuthSession,
  getAuthSessionSnapshot,
  saveAuthSession,
  subscribeAuthSession,
} from './session'

const tokens = { accessToken: 'access', refreshToken: 'refresh' }

describe('auth session store', () => {
  beforeEach(() => {
    localStorage.clear()
    // 모듈 전역에 남아 있는 만료 플래그까지 초기화합니다.
    clearAuthSession()
  })

  it('저장과 삭제 시 구독자에게 알린다', () => {
    const listener = vi.fn()
    const unsubscribe = subscribeAuthSession(listener)

    saveAuthSession(tokens)
    expect(listener).toHaveBeenCalledTimes(1)
    expect(getAuthSessionSnapshot().isAuthenticated).toBe(true)

    clearAuthSession()
    expect(listener).toHaveBeenCalledTimes(2)
    expect(getAuthSessionSnapshot().isAuthenticated).toBe(false)

    unsubscribe()
    saveAuthSession(tokens)
    expect(listener).toHaveBeenCalledTimes(2)
  })

  it('값이 그대로면 같은 스냅샷 객체를 돌려준다', () => {
    saveAuthSession(tokens)

    expect(getAuthSessionSnapshot()).toBe(getAuthSessionSnapshot())
  })

  it('만료로 정리된 경우에만 expired가 true가 된다', () => {
    saveAuthSession(tokens)

    clearAuthSession({ expired: true })
    expect(getAuthSessionSnapshot()).toEqual({ isAuthenticated: false, expired: true })

    // 다시 로그인하면 만료 상태가 사라진다.
    saveAuthSession(tokens)
    expect(getAuthSessionSnapshot()).toEqual({ isAuthenticated: true, expired: false })
  })

  it('직접 로그아웃한 경우에는 expired가 false다', () => {
    saveAuthSession(tokens)
    clearAuthSession()

    expect(getAuthSessionSnapshot()).toEqual({ isAuthenticated: false, expired: false })
  })

  it('다른 탭에서 토큰이 바뀌면 구독자에게 알린다', () => {
    const listener = vi.fn()
    const unsubscribe = subscribeAuthSession(listener)

    window.dispatchEvent(new StorageEvent('storage', { key: 'accessToken' }))
    expect(listener).toHaveBeenCalledTimes(1)

    // 다른 탭의 localStorage.clear()는 key가 null로 전달됩니다.
    window.dispatchEvent(new StorageEvent('storage', { key: null }))
    expect(listener).toHaveBeenCalledTimes(2)

    // 무관한 키 변경은 무시합니다.
    window.dispatchEvent(new StorageEvent('storage', { key: 'theme' }))
    expect(listener).toHaveBeenCalledTimes(2)

    unsubscribe()
    window.dispatchEvent(new StorageEvent('storage', { key: 'accessToken' }))
    expect(listener).toHaveBeenCalledTimes(2)
  })
})
