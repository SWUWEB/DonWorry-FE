const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'

interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthSessionSnapshot {
  isAuthenticated: boolean
  // refresh 실패로 세션이 정리된 직후인지. 로그인 화면에서 만료 안내를 띄우는 데만 사용합니다.
  expired: boolean
}

interface ClearOptions {
  expired?: boolean
}

// 세션은 localStorage에 있지만 localStorage는 변경을 알려주지 않습니다. 인터셉터가 만료로
// 세션을 지웠을 때 화면이 즉시 반응하도록, 이 모듈이 변경 통지를 함께 담당합니다.
const listeners = new Set<() => void>()
let expiredFlag = false
let snapshot: AuthSessionSnapshot = { isAuthenticated: false, expired: false }

function readIsAuthenticated(): boolean {
  return Boolean(localStorage.getItem(ACCESS_TOKEN_KEY) || localStorage.getItem(REFRESH_TOKEN_KEY))
}

function handleStorage(event: StorageEvent): void {
  // localStorage.clear()는 key가 null인 이벤트로 전달됩니다.
  if (event.key !== null && event.key !== ACCESS_TOKEN_KEY && event.key !== REFRESH_TOKEN_KEY) {
    return
  }

  // 다른 탭에서 다시 로그인했다면 이 탭이 들고 있던 만료 표시는 더 이상 유효하지 않습니다.
  // 남겨두면 이후 정상 로그아웃에서도 만료 안내가 잘못 뜹니다.
  if (readIsAuthenticated()) expiredFlag = false

  notify()
}

function notify(): void {
  for (const listener of [...listeners]) listener()
}

// TODO: 백엔드가 HttpOnly 쿠키 세션을 지원하면 이 모듈만 교체합니다.
export function saveAuthSession({ accessToken, refreshToken }: AuthTokens): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  expiredFlag = false
  notify()
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function hasAuthSession(): boolean {
  return readIsAuthenticated()
}

// useSyncExternalStore 규약상 값이 그대로면 같은 객체를 돌려줘야 합니다. 매번 localStorage를
// 다시 읽으므로 다른 탭이나 테스트가 직접 값을 바꿔도 최신 상태가 반영됩니다.
export function getAuthSessionSnapshot(): AuthSessionSnapshot {
  const isAuthenticated = readIsAuthenticated()
  const expired = isAuthenticated ? false : expiredFlag

  if (snapshot.isAuthenticated !== isAuthenticated || snapshot.expired !== expired) {
    snapshot = { isAuthenticated, expired }
  }

  return snapshot
}

export function subscribeAuthSession(listener: () => void): () => void {
  if (listeners.size === 0) {
    window.addEventListener('storage', handleStorage)
  }
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) {
      window.removeEventListener('storage', handleStorage)
    }
  }
}

export function clearAuthSession({ expired = false }: ClearOptions = {}): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  expiredFlag = expired
  notify()
}
