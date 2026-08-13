import { useMutation } from '@tanstack/react-query'
import { sendVerificationEmail } from '@/api/auth'

export function useSendVerificationEmail() {
  return useMutation({
    mutationFn: sendVerificationEmail,
  })
}
