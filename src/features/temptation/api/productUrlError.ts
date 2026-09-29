import axios from 'axios'

export type ProductUrlErrorKind = 'AUTH' | 'PARSE_FAILED' | 'SERVER_ERROR'

export function getProductUrlErrorKind(error: unknown): ProductUrlErrorKind {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    if (status === 401) return 'AUTH'
    if (status === 400 || status === 422) return 'PARSE_FAILED'
  }
  return 'SERVER_ERROR'
}

export function getProductUrlErrorMessage(error: unknown): string {
  const kind = getProductUrlErrorKind(error)

  switch (kind) {
    case 'AUTH':
      return '로그인이 필요합니다. 로그인 후 다시 시도해주세요.'
    case 'PARSE_FAILED':
      return '해당 URL에서 상품 정보를 불러올 수 없습니다. 직접 입력해주세요.'
    case 'SERVER_ERROR':
    default:
      return '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
  }
}
