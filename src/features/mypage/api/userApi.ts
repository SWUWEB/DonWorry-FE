import client from '@/api/client'
import type {
  DeleteApiV1UsersMeData,
  PatchApiV1UsersMeData,
  PatchApiV1UsersMePasswordData,
  PutApiV1UsersMeBudgetData,
  PutApiV1UsersMeSavingGoalData,
  GetSavingGoalResponse,
  UpdateSavingGoalResponse,
  PostApiV1UsersMeEmailVerificationsData,
  PatchApiV1UsersMeEmailData,
  EmailChangeVerificationResponse,
  ChangeEmailResponse,
} from '@/api/generated'
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

export type UpdateProfileRequest = PatchApiV1UsersMeData['body']

// 스웨거 DELETE /users/me 요청 스키마의 reasonType enum 전체 목록
export type WithdrawReasonType = NonNullable<DeleteApiV1UsersMeData['body']['reasonType']>

export type WithdrawRequest = DeleteApiV1UsersMeData['body']

export interface SavingGoal {
  savingGoalText: string | null
  targetSavingAmount: number | null
  savingGoalIsActive: boolean
  savedAmount: number | null
  achievementRate: number | null
}

function adaptSavingGoal(result: GetSavingGoalResponse['data']): SavingGoal {
  if (!result) throw new Error('목표 정보를 불러오지 못했습니다.')
  return {
    savingGoalText: result.savingGoalText ?? null,
    targetSavingAmount:
      result.targetSavingAmount == null ? null : Number(result.targetSavingAmount),
    savingGoalIsActive: result.savingGoalIsActive ?? false,
    savedAmount: result.savedAmount == null ? null : Number(result.savedAmount),
    achievementRate: result.achievementRate ?? null,
  }
}

export type SendEmailChangeRequest = PostApiV1UsersMeEmailVerificationsData['body']
export type ChangeEmailRequest = PatchApiV1UsersMeEmailData['body']

export type SetSavingGoalRequest = PutApiV1UsersMeSavingGoalData['body']

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
  hourlyWage: number | null
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
  hourlyWage?: number
  categoryBudgets?: Pick<CategoryBudget, 'category' | 'budgetAmount'>[]
}

interface MonthlyBudgetResult {
  yearMonth: string
  monthlyIncome: string | null
  monthlyBudget: string
  spentAmount: string
  remainingAmount: string
  usageRate: number
  hourlyWage: string | null
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
    hourlyWage: result.hourlyWage === null ? null : Number(result.hourlyWage),
    categoryBudgets: result.categoryBudgets.map((category) => ({
      category: CATEGORY_CODE_TO_LABEL[category.categoryCode],
      budgetAmount: Number(category.budgetAmount),
      spentAmount: Number(category.spentAmount),
      remainingAmount: Number(category.remainingAmount),
      usageRate: category.usageRate,
    })),
  }
}

export type ChangePasswordRequest = PatchApiV1UsersMePasswordData['body']

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

  getSavingGoal: async (): Promise<SavingGoal> => {
    const { data } = await client.get<GetSavingGoalResponse>('/api/v1/users/me/saving-goal')
    return adaptSavingGoal(data.data)
  },

  setSavingGoal: async (body: SetSavingGoalRequest): Promise<SavingGoal> => {
    const { data } = await client.put<UpdateSavingGoalResponse>(
      '/api/v1/users/me/saving-goal',
      body,
    )
    return adaptSavingGoal(data.data)
  },

  sendEmailChangeCode: async (body: SendEmailChangeRequest) => {
    const { data } = await client.post<EmailChangeVerificationResponse>(
      '/api/v1/users/me/email-verifications',
      body,
    )
    return data.data
  },

  changeEmail: async (body: ChangeEmailRequest) => {
    const { data } = await client.patch<ChangeEmailResponse>('/api/v1/users/me/email', body)
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
    const requestBody: PutApiV1UsersMeBudgetData['body'] = {
      yearMonth: body.yearMonth,
      ...(body.monthlyIncome !== undefined && { monthlyIncome: body.monthlyIncome }),
      ...(body.monthlyBudget !== undefined && { monthlyBudget: body.monthlyBudget }),
      ...(body.hourlyWage !== undefined && { hourlyWage: body.hourlyWage }),
      ...(body.categoryBudgets !== undefined && {
        categoryBudgets: body.categoryBudgets.map(({ category, budgetAmount }) => ({
          categoryCode: CATEGORY_LABEL_TO_CODE[category] as CategoryCode,
          budgetAmount,
        })),
      }),
    }
    const { data } = await client.put<ApiResponse<MonthlyBudgetResult>>(
      '/api/v1/users/me/budget',
      requestBody,
    )
    return adaptBudget(data.data)
  },

  changePassword: async (body: ChangePasswordRequest): Promise<void> => {
    await client.patch('/api/v1/users/me/password', body)
  },
}
