import { useMutation } from '@tanstack/react-query'
import { confirmKakaoLinkEmail } from '@/api/auth'

export const useConfirmKakaoLinkEmail = () => {
  return useMutation({
    mutationFn: confirmKakaoLinkEmail,
  })
}
