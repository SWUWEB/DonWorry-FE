import { useMutation } from '@tanstack/react-query'
import { signUp } from '@/api/auth'

export function useSignup() {
  return useMutation({
    mutationFn: signUp,
  })
}
