import client from '@/api/client'

const ONBOARDING_URL = '/api/v1/onboarding'

export interface UpdateOnboardingPayload {
  interestTags: string[]
  savingGoalText: string
  targetSavingAmount: number
}

export interface OnboardingResult {
  interestTags: string[] | null
  savingGoalText: string | null
  targetSavingAmount: string | null
}

export const onboardingApi = {
  get: async (): Promise<OnboardingResult> => {
    const { data } = await client.get<{ data: OnboardingResult }>(ONBOARDING_URL)
    return data.data
  },

  update: async (payload: UpdateOnboardingPayload): Promise<OnboardingResult> => {
    const { data } = await client.put<{ data: OnboardingResult }>(ONBOARDING_URL, payload)
    return data.data
  },
}
