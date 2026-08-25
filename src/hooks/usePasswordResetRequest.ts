import { useMutation } from '@tanstack/react-query'
import { requestPasswordReset } from '@/api/auth'

export const usePasswordResetRequest = () => {
  return useMutation({
    mutationFn: requestPasswordReset,
  })
}
