import { useMutation } from '@tanstack/react-query'
import { kakaoLink } from '@/api/auth'

export const useKakaoLink = () => {
  return useMutation({
    mutationFn: kakaoLink,
  })
}
