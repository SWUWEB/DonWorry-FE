import { useSyncExternalStore } from 'react'
import { getAuthSessionSnapshot, subscribeAuthSession } from './session'
import type { AuthSessionSnapshot } from './session'

// 세션 저장/삭제와 다른 탭의 변경까지 구독해, 토큰이 사라지는 즉시 화면이 다시 그려지게 합니다.
export function useAuthSession(): AuthSessionSnapshot {
  return useSyncExternalStore(subscribeAuthSession, getAuthSessionSnapshot, getAuthSessionSnapshot)
}
