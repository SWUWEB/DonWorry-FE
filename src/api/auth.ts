import client from './client'

export interface SignUpRequest {
  name: string
  loginId: string
  email: string
  emailVerificationToken: string
  password: string
  passwordConfirm: string
  phoneNumber: string
}

export interface SignUpResponse {
  success: boolean
  message: string

  data: {
    userId: string
    loginId: string
    name: string
    email: string
    phoneNumber: string
  }
}

export const signUp = async (body: SignUpRequest): Promise<SignUpResponse> => {
  const { data } = await client.post<SignUpResponse>('/api/v1/auth/signup', body)

  return data
}

export interface SendEmailRequest {
  email: string
}

export interface ConfirmEmailRequest {
  email: string
  code: string
}

export interface SendEmailResponse {
  success: boolean
  message: string

  data: {
    email: string
    codeTtlSeconds: number
    resendCooldownSeconds: number
    debugCode: string
  }
}

export interface ConfirmEmailResponse {
  success: boolean
  message: string

  data: {
    email: string
    emailVerificationToken: string
  }
}

export const sendVerificationEmail = async (body: SendEmailRequest): Promise<SendEmailResponse> => {
  const { data } = await client.post<SendEmailResponse>('/api/v1/auth/email-verifications', body)

  return data
}

export const confirmVerificationEmail = async (
  body: ConfirmEmailRequest,
): Promise<ConfirmEmailResponse> => {
  const { data } = await client.post<ConfirmEmailResponse>(
    '/api/v1/auth/email-verifications/confirm',
    body,
  )

  return data
}
