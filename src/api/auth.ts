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

// 로그인

export interface LoginRequest {
  loginId: string
  password: string
}

export interface LoginResponse {
  success: boolean
  message: string

  data: {
    accessToken: string
    refreshToken: string
    tokenType: string

    user: {
      userId: string
      loginId: string
      name: string
      email: string
      phoneNumber: string
    }
  }
}

export const login = async (body: LoginRequest): Promise<LoginResponse> => {
  const { data } = await client.post<LoginResponse>('/api/v1/auth/login', body)

  return data
}

// 로그아웃

export interface LogoutRequest {
  refreshToken: string
}

export const logout = async (body: LogoutRequest): Promise<void> => {
  await client.post('/api/v1/auth/logout', body)
}
