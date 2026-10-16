import { useMutation } from '@tanstack/react-query'
import { confirmPasswordReset } from '@/api/auth'

export const usePasswordResetConfirm = () => {
  return useMutation({
    mutationFn: confirmPasswordReset,
  })
}
