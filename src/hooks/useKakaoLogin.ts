import { useMutation } from '@tanstack/react-query'
import { kakaoLogin } from '@/api/auth'

export const useKakaoLogin = () => {
  return useMutation({
    mutationFn: kakaoLogin,
  })
}
