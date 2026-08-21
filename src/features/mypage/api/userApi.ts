import client from '@/api/client'
import { CATEGORY_LABEL_TO_CODE } from '@/constants/product'
import { CATEGORY_CODE_TO_LABEL } from '@/constants/budgetCategory'
import type { CategoryCode, CategoryLabel } from '@/constants/budgetCategory'

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
  email: string
  loginProvider: 'LOCAL' | 'KAKAO'
  hasPassword: boolean
  hourlyWage: string | null
}

export type UpdatedUserProfile = Omit<
  UserProfile,
  'email' | 'loginProvider' | 'hasPassword' | 'hourlyWage'
>

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
  monthlyIncome: number | null
  monthlyBudget: number
  spentAmount: number
  remainingAmount: number
  usageRate: number
  categoryBudgets: CategoryBudget[]
}

export interface CategoryBudget {
  category: CategoryLabel
  budgetAmount: number
  spentAmount: number
  remainingAmount: number
  usageRate: number
}

export interface SetBudgetRequest {
  yearMonth: string
  monthlyIncome?: number
  monthlyBudget?: number
  categoryBudgets?: Pick<CategoryBudget, 'category' | 'budgetAmount'>[]
}

interface MonthlyBudgetResult {
  yearMonth: string
  monthlyIncome: string | null
  monthlyBudget: string
  spentAmount: string
  remainingAmount: string
  usageRate: number
  categoryBudgets: {
    categoryCode: CategoryCode
    budgetAmount: string
    spentAmount: string
    remainingAmount: string
    usageRate: number
  }[]
}

function adaptBudget(result: MonthlyBudgetResult): Budget {
  return {
    yearMonth: result.yearMonth,
    monthlyIncome: result.monthlyIncome === null ? null : Number(result.monthlyIncome),
    monthlyBudget: Number(result.monthlyBudget),
    spentAmount: Number(result.spentAmount),
    remainingAmount: Number(result.remainingAmount),
    usageRate: result.usageRate,
    categoryBudgets: result.categoryBudgets.map((category) => ({
      category: CATEGORY_CODE_TO_LABEL[category.categoryCode],
      budgetAmount: Number(category.budgetAmount),
      spentAmount: Number(category.spentAmount),
      remainingAmount: Number(category.remainingAmount),
      usageRate: category.usageRate,
    })),
  }
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

  updateMe: async (body: UpdateProfileRequest): Promise<UpdatedUserProfile> => {
    const { data } = await client.patch<ApiResponse<UpdatedUserProfile>>('/api/v1/users/me', body)
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
    const { data } = await client.get<ApiResponse<MonthlyBudgetResult | null>>(
      '/api/v1/users/me/budget',
      { params: { yearMonth } },
    )
    return data.data === null ? null : adaptBudget(data.data)
  },

  setBudget: async (body: SetBudgetRequest): Promise<Budget> => {
    const { data } = await client.put<ApiResponse<MonthlyBudgetResult>>('/api/v1/users/me/budget', {
      yearMonth: body.yearMonth,
      ...(body.monthlyIncome !== undefined && { monthlyIncome: body.monthlyIncome }),
      ...(body.monthlyBudget !== undefined && { monthlyBudget: body.monthlyBudget }),
      ...(body.categoryBudgets !== undefined && {
        categoryBudgets: body.categoryBudgets.map(({ category, budgetAmount }) => ({
          categoryCode: CATEGORY_LABEL_TO_CODE[category],
          budgetAmount,
        })),
      }),
    })
    return adaptBudget(data.data)
  },

  // 스웨거상 성공(200) 응답이 명시돼 있지 않고 501(NotImplemented)만 문서화된,
  // 백엔드에서 아직 구현 중인 엔드포인트입니다.
  changePassword: async (body: ChangePasswordRequest): Promise<void> => {
    await client.patch('/api/v1/users/me/password', body)
  },
}
