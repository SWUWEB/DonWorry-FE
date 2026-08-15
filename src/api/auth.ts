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

export interface CheckEmailRequest {
  email: string
}

export interface CheckEmailResponse {
  success: boolean
  message: string

  data: {
    available: boolean
  }
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
    // 개발 편의용 필드라 운영 환경에서는 내려오지 않을 수 있습니다.
    debugCode?: string
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

//이메일 중복확인

export const checkEmail = async (email: string): Promise<CheckEmailResponse> => {
  const { data } = await client.get<CheckEmailResponse>('/api/v1/auth/check-email', {
    params: {
      email,
    },
  })

  return data
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

// 카카오
export interface KakaoLoginRequest {
  authorizationCode: string
}

export const kakaoLogin = async (body: KakaoLoginRequest): Promise<LoginResponse> => {
  const { data } = await client.post<LoginResponse>('/api/v1/auth/kakao/login', body)

  return data
}

// 카카오 계정 연결 (비밀번호 인증)

export interface KakaoLinkRequest {
  linkingToken: string
  password: string
}

export const kakaoLink = async (body: KakaoLinkRequest): Promise<LoginResponse> => {
  const { data } = await client.post<LoginResponse>('/api/v1/auth/kakao/link', body)

  return data
}

//카카오 계정 연결 이메일 인증요청
export interface KakaoLinkEmailRequest {
  linkingToken: string
}

export interface KakaoLinkEmailResponse {
  success: boolean
  message: string

  data: {
    email: string
    codeTtlSeconds: number
    resendCooldownSeconds: number
    debugCode?: string
  }
}

export const sendKakaoLinkEmail = async (
  body: KakaoLinkEmailRequest,
): Promise<KakaoLinkEmailResponse> => {
  const { data } = await client.post<KakaoLinkEmailResponse>(
    '/api/v1/auth/kakao/link/email-verifications',
    body,
  )

  return data
}

//이메일 인증으로 카카오계정연결
export interface ConfirmKakaoLinkEmailRequest {
  linkingToken: string
  code: string
}

export const confirmKakaoLinkEmail = async (
  body: ConfirmKakaoLinkEmailRequest,
): Promise<LoginResponse> => {
  const { data } = await client.post<LoginResponse>(
    '/api/v1/auth/kakao/link/email-verifications/confirm',
    body,
  )

  return data
}
