import { isAxiosError } from 'axios'

// 백엔드가 내려주는 공통 에러 바디 (code로 케이스를 구분하고, message는 그대로 보여줘도 되는 문구)
interface KakaoApiError {
  code?: string
  message?: string
  retryAfterSeconds?: number
}

function getKakaoApiError(error: unknown): KakaoApiError | null {
  if (!isAxiosError(error)) return null
  return (error.response?.data as KakaoApiError | undefined) ?? null
}

export function isKakaoLinkRequired(error: unknown): boolean {
  return getKakaoApiError(error)?.code === 'AUTH4093'
}

// POST /auth/kakao/login 실패 처리
export function getKakaoLoginErrorMessage(error: unknown): string {
  const apiError = getKakaoApiError(error)
  if (!apiError) return '카카오 로그인에 실패했습니다.'

  switch (apiError.code) {
    case 'AUTH4004':
      return '카카오 계정의 이메일·닉네임 제공에 동의해야 로그인할 수 있어요. 카카오 로그인 화면에서 정보 제공에 동의한 뒤 다시 시도해주세요.'
    case 'AUTH4094':
      return '이미 다른 계정에 연결된 카카오 계정입니다.'
    case 'AUTH5021':
      return '카카오 로그인 서비스와 통신하지 못했습니다. 잠시 후 다시 시도해주세요.'
    default:
      return apiError.message ?? '카카오 로그인에 실패했습니다.'
  }
}

// POST /auth/kakao/link, /link/email-verifications, /link/email-verifications/confirm 실패 처리
export function getKakaoLinkErrorMessage(error: unknown): { message: string; expired: boolean } {
  const apiError = getKakaoApiError(error)
  if (!apiError)
    return { message: '요청에 실패했습니다. 잠시 후 다시 시도해주세요.', expired: false }

  switch (apiError.code) {
    case 'AUTH4014':
      return {
        message: '연결 세션이 만료됐어요. 카카오 로그인을 다시 시작해주세요.',
        expired: true,
      }
    case 'AUTH4291': {
      const retry = apiError.retryAfterSeconds
      const base = apiError.message ?? '시도가 너무 많습니다.'
      return { message: retry ? `${base} (${retry}초 후 다시 시도)` : base, expired: false }
    }
    default:
      return { message: apiError.message ?? '요청에 실패했습니다.', expired: false }
  }
}
