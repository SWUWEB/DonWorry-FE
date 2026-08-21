const KAKAO_AUTHORIZE_URL = 'https://kauth.kakao.com/oauth/authorize'
const STATE_STORAGE_KEY = 'kakaoOAuthState'

// 카카오 인가 요청 ↔ 콜백을 연결하는 1회용 CSRF 방지 토큰입니다.
// 리다이렉트 직전에 생성해 sessionStorage에 저장하고, 콜백에서 검증 후 즉시 지웁니다.
function generateState(): string {
  return crypto.randomUUID()
}

// 카카오 개발자 콘솔에 등록된 REST API 키/Redirect URI를 .env에서 읽습니다.
// (VITE_KAKAO_CLIENT_ID, VITE_KAKAO_REDIRECT_URI)
export function getKakaoAuthorizeUrl(): string {
  const clientId = import.meta.env.VITE_KAKAO_CLIENT_ID
  const redirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI

  if (!clientId || !redirectUri) {
    throw new Error(
      'VITE_KAKAO_CLIENT_ID / VITE_KAKAO_REDIRECT_URI가 설정되지 않았습니다. .env.local을 확인해주세요.',
    )
  }

  const state = generateState()
  sessionStorage.setItem(STATE_STORAGE_KEY, state)

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    state,
  })

  return `${KAKAO_AUTHORIZE_URL}?${params.toString()}`
}

// 콜백에서 받은 state가 우리가 생성한 값과 일치하는지 확인합니다. 일치 여부와 무관하게
// 1회용이므로 검증 즉시(성공/실패 모두) 지웁니다.
export function consumeKakaoState(receivedState: string | null): boolean {
  const savedState = sessionStorage.getItem(STATE_STORAGE_KEY)
  sessionStorage.removeItem(STATE_STORAGE_KEY)

  return Boolean(savedState) && savedState === receivedState
}
