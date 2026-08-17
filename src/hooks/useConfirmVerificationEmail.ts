import { useMutation } from '@tanstack/react-query'
import { confirmVerificationEmail } from '@/api/auth'

export function useConfirmVerificationEmail() {
  return useMutation({
    mutationFn: confirmVerificationEmail,
  })
}
