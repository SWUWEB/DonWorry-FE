const KEY = 'onboarding_draft'

export interface OnboardingDraft {
  interests?: { id: string; emoji: string; label: string }[]
  purposeId?: string | null
  purposeLabel?: string
  purposeEmoji?: string
  amount?: number
  amountInput?: string
}

export function getOnboardingDraft(): OnboardingDraft {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) ?? '{}')
  } catch {
    return {}
  }
}

export function saveOnboardingDraft(patch: Partial<OnboardingDraft>): void {
  sessionStorage.setItem(KEY, JSON.stringify({ ...getOnboardingDraft(), ...patch }))
}

export function clearOnboardingDraft(): void {
  sessionStorage.removeItem(KEY)
}
