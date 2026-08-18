import client from '@/api/client'

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface UserProfile {
  id: string
  nickname: string
  profileImageUrl: string | null
  savingGoalText: string | null
  interestTagsJson: string[] | null
  phoneNumber: string | null
  birthDate: string | null
  gender: 'FEMALE' | 'MALE' | null
}

export interface UpdateProfileRequest {
  nickname?: string
  profileImageUrl?: string | null
  interestTags?: string[]
  phoneNumber?: string | null
  birthDate?: string | null
  gender?: 'FEMALE' | 'MALE'
}

// 스웨거 DELETE /users/me 요청 스키마의 reasonType enum 전체 목록
export type WithdrawReasonType =
  | 'LOW_FREQUENCY'
  | 'MISSING_FEATURE'
  | 'INCONVENIENT'
  | 'PRIVACY_CONCERN'
  | 'SWITCHING_SERVICE'
  | 'OTHER'

export interface WithdrawRequest {
  password: string
  reasonType?: WithdrawReasonType
}

export interface SavingGoal {
  id: string
  savingGoalText: string
  targetSavingAmount: string
  savingGoalIsActive: boolean
}

export interface SetSavingGoalRequest {
  savingGoalText: string
  targetSavingAmount: number
  savingGoalIsActive?: boolean
}

export interface DeleteSavingGoalResult {
  id: string
  savingGoalIsActive: boolean
}

export interface Budget {
  yearMonth: string
  monthlyIncome: string | null
  monthlyBudget: string
}

export interface SetBudgetRequest {
  yearMonth: string
  monthlyIncome?: number
  monthlyBudget: number
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export const userApi = {
  getMe: async (): Promise<UserProfile> => {
    const { data } = await client.get<ApiResponse<UserProfile>>('/api/v1/users/me')
    return data.data
  },

  updateMe: async (body: UpdateProfileRequest): Promise<UserProfile> => {
    const { data } = await client.patch<ApiResponse<UserProfile>>('/api/v1/users/me', body)
    return data.data
  },

  deleteMe: async (body: WithdrawRequest): Promise<void> => {
    await client.delete('/api/v1/users/me', { data: body })
  },

  setSavingGoal: async (body: SetSavingGoalRequest): Promise<SavingGoal> => {
    const { data } = await client.put<ApiResponse<SavingGoal>>('/api/v1/users/me/saving-goal', body)
    return data.data
  },

  deleteSavingGoal: async (): Promise<DeleteSavingGoalResult> => {
    const { data } = await client.delete<ApiResponse<DeleteSavingGoalResult>>(
      '/api/v1/users/me/saving-goal',
    )
    return data.data
  },

  // 아직 예산을 설정하지 않은 달은 data가 null로 내려옵니다.
  getBudget: async (yearMonth: string): Promise<Budget | null> => {
    const { data } = await client.get<ApiResponse<Budget | null>>('/api/v1/users/me/budget', {
      params: { yearMonth },
    })
    return data.data
  },

  setBudget: async (body: SetBudgetRequest): Promise<Budget> => {
    const { data } = await client.put<ApiResponse<Budget>>('/api/v1/users/me/budget', body)
    return data.data
  },

  // 스웨거상 성공(200) 응답이 명시돼 있지 않고 501(NotImplemented)만 문서화된,
  // 백엔드에서 아직 구현 중인 엔드포인트입니다.
  changePassword: async (body: ChangePasswordRequest): Promise<void> => {
    await client.patch('/api/v1/users/me/password', body)
  },
}
