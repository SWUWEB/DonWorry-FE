const KAKAO_AUTHORIZE_URL = 'https://kauth.kakao.com/oauth/authorize'

// 카카오 개발자 콘솔에 등록된 REST API 키/Redirect URI를 .env에서 읽습니다.
// (VITE_KAKAO_CLIENT_ID, VITE_KAKAO_REDIRECT_URI)
export function getKakaoAuthorizeUrl(): string {
  const clientId = import.meta.env.VITE_KAKAO_CLIENT_ID
  const redirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
  })

  return `${KAKAO_AUTHORIZE_URL}?${params.toString()}`
}
