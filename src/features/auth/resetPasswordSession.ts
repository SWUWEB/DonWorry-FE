const KEY = 'reset_password_draft'

export interface ResetPasswordDraft {
  email?: string
  code?: string
  codeVerified?: boolean
}

export function getResetPasswordDraft(): ResetPasswordDraft {
  try {
    const parsed: unknown = JSON.parse(sessionStorage.getItem(KEY) ?? '{}')
    if (typeof parsed !== 'object' || parsed === null) return {}

    // 필드별로 타입을 검증합니다. 값이 null이거나 형태가 어긋나면
    // draft.email 등에 접근하는 화면(ResetPasswordVerify/New)이 가드보다 먼저 오류를 낼 수 있습니다.
    const { email, code, codeVerified } = parsed as Record<string, unknown>
    return {
      email: typeof email === 'string' ? email : undefined,
      code: typeof code === 'string' ? code : undefined,
      codeVerified: typeof codeVerified === 'boolean' ? codeVerified : undefined,
    }
  } catch {
    return {}
  }
}

export function saveResetPasswordDraft(patch: Partial<ResetPasswordDraft>): void {
  sessionStorage.setItem(KEY, JSON.stringify({ ...getResetPasswordDraft(), ...patch }))
}

export function clearResetPasswordDraft(): void {
  sessionStorage.removeItem(KEY)
}
