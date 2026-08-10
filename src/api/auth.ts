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
