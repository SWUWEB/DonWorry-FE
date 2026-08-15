const KEY = 'reset_password_draft'

export interface ResetPasswordDraft {
  email?: string
  codeVerified?: boolean
}

export function getResetPasswordDraft(): ResetPasswordDraft {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) ?? '{}')
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
