import { useMutation } from '@tanstack/react-query'
import { sendKakaoLinkEmail } from '@/api/auth'

export const useKakaoLinkEmail = () => {
  return useMutation({
    mutationFn: sendKakaoLinkEmail,
  })
}
